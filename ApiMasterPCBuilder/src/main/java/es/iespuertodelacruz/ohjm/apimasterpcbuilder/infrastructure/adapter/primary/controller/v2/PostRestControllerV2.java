package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IPostService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.PostOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.PostInputDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.PostOutputDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/posts")
public class PostRestControllerV2 {

    @Autowired
    IPostService service;

    @Autowired
    IBuildService buildService;

    @Autowired
    IUserService userService;

    @Autowired
    FileStorageService storageService;

    PostOutputDTOMapper outputDTOMapper = new PostOutputDTOMapper();

    PostInputDTOMapper inputDTOMapper = new PostInputDTOMapper();

    @GetMapping
    public ResponseEntity<?> findAll(@RequestParam(value = "buildId", required = false) Long buildId, @RequestParam(value = "userId", required = false) Long userId) {
        List<PostOutputDTO> res = new ArrayList<>();
        if (buildId != null) {
            List<Post> byBuildId = service.findByBuildId(buildId);
            for (Post post : byBuildId) {
                PostOutputDTO outputDTO = outputDTOMapper.toDTO(post);
                res.add(outputDTO);
            }
        } else if (userId != null) {
            List<Post> byUserId = service.findByUserId(userId);
            for (Post post : byUserId) {
                PostOutputDTO outputDTO = outputDTOMapper.toDTO(post);
                res.add(outputDTO);
            }
        } else {
            List<Post> all = service.findAll();
            for (Post post : all) {
                PostOutputDTO outputDTO = outputDTOMapper.toDTO(post);
                res.add(outputDTO);
            }
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody PostInputDTO inputDTO) {
        if (inputDTO != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User byNick = userService.findByNick(username);

            if (byNick != null) {
                Post post = inputDTOMapper.toDomain(inputDTO);
                post.setUser(byNick);
                Build build = buildService.findById(inputDTO.getBuildId());
                if (build != null) {
                    if (build.getUser().getId() != byNick.getId()) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not your build");
                    }
                    String codedPicture = inputDTO.getImage64();
                    byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
                    String newFileName = storageService.save(byNick.getNick() + "_" + inputDTO.getImage(), photoBytes);
                    post.setImage(newFileName);
                    post.setBuild(build);
                    Post save = service.save(post);
                    if (save != null) {
                        return ResponseEntity.ok(outputDTOMapper.toDTO(save));
                    } else {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Build not found");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post must not be null");
        }
    }

    @GetMapping("/img/{id}/{filename}")
    public ResponseEntity<?> getFiles(@PathVariable("id") long postId, @PathVariable("filename") String filename) {
        Post byId = service.findById(postId);
        if (byId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The post does not exist");
        }
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);

        if (userByNick != null) {
            if (!byId.getImage().equals(filename)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not the right image");
            }
            Resource resource = null;
            try {
                resource = storageService.get(filename);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The file does not exist");
            }
            String contentType = null;
            try {
                contentType = URLConnection.guessContentTypeFromStream(resource.getInputStream());
            } catch (IOException ex) {
                System.out.println("Could not determine file type.");
            }
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String headerValue = "attachment; filename=\"" + resource.getFilename() + "\"";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(
                            org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            headerValue
                    ).body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable long id) {
        Post post = service.findById(id);
        if (post != null) {
            return ResponseEntity.ok(outputDTOMapper.toDTO(post));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (id != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User byNick = userService.findByNick(username);

            if (byNick != null) {
                Post postById = service.findById(id);
                if (postById != null) {
                    if (postById.getUser().getId() == byNick.getId()) {
                        boolean ok = service.deleteById(id);

                        if (ok) {
                            return ResponseEntity.ok("Post Successfully Deleted");
                        } else {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not your post");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The post with the provided id was not found");
                }

            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody PostInputDTO postInputDTO, @PathVariable("id") Long id) {
        if (postInputDTO != null && id != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);

            if (userByNick != null) {
                Post postById = service.findById(id);
                if (postById != null) {
                    if (postById.getUser().getId() == userByNick.getId()) {
                        Post post = inputDTOMapper.toDomain(postInputDTO);
                        post.setId(id);
                        post.setUser(userByNick);
                        Build build = buildService.findById(postInputDTO.getBuildId());
                        if (build != null) {
                            if (build.getUser().getId() != userByNick.getId()) {
                                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not your build");
                            }
                            post.setBuild(build);
                            boolean ok = service.update(post);

                            if (ok) {
                                return ResponseEntity.ok("Post Successfully Updated");
                            } else {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                            }
                        } else {
                            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Build not found");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not your post");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The post with the provided id was not found");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The body must not be null");
        }
    }

    @PutMapping("/{id}/like/{userId}")
    public ResponseEntity<?> like(@PathVariable("id") Long id, @PathVariable("userId") Long userId) {
        if (id != null && userId != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);

            if (userByNick != null) {
                Post postById = service.findById(id);
                if (postById != null) {
                    if (id != userByNick.getId()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You cannot like with another user id");
                    }
                    if (postById.getUsersWhoLiked().contains(userByNick)) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You already liked this post");
                    }
                    User userById = userService.findById(userId);
                    if (userById != null) {
                        postById.getUsersWhoLiked().add(userById);
                        boolean ok = service.update(postById);
                        if (ok) {
                            return ResponseEntity.ok("Post Successfully Liked");
                        } else {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The post with the provided id was not found");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }

    @PutMapping("/{id}/dislike/{userId}")
    public ResponseEntity<?> dislike(@PathVariable("id") Long id, @PathVariable("userId") Long userId) {
        if (id != null && userId != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);

            if (userByNick != null) {
                Post postById = service.findById(id);
                if (postById != null) {
                    if (id != userByNick.getId()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You cannot like with another user id");
                    }
                    User userById = userService.findById(userId);
                    if (userById != null) {
                        postById.getUsersWhoLiked().remove(userById);
                        boolean ok = service.update(postById);
                        if (ok) {
                            return ResponseEntity.ok("Post Successfully Liked");
                        } else {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The post with the provided id was not found");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }
}
