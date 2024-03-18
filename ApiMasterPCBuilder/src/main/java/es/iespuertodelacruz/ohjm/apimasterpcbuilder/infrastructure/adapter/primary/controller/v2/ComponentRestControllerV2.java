package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Post;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ProductAmazonDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ProductEbayDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentInputDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentOutputDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.lang.annotation.Documented;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/components")
public class ComponentRestControllerV2 {
    private final WebClient webClient;
    Logger log;
    @Autowired
    public ComponentRestControllerV2(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://127.0.0.1:8000").build();
    }


    @Autowired
    IComponentService componentService;

    @Autowired
    ISellerService sellerService;

    @Autowired
    IUserService userService;

    @Autowired
    FileStorageService storageService;

    ComponentInputDTOMapper inputDTOMapper = new ComponentInputDTOMapper();

    ComponentOutputDTOMapper outputDTOMapper = new ComponentOutputDTOMapper();

    @GetMapping
    public ResponseEntity<?> getAllOrByName(@RequestParam(value = "name", required = false) String name, @RequestParam(value = "userId", required = false) Long userId) {
        if (name != null) {
            List<Component> components = componentService.findByName(name);
            List<ComponentOutputDTO> componentsDTO = new ArrayList<>();
            if (components != null) {
                for (Component comp : components) {
                    ComponentOutputDTO compOutputDTO = outputDTOMapper.toDTO(comp);
                    componentsDTO.add(compOutputDTO);
                }

                return ResponseEntity.ok(componentsDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
            }
        } else if (userId != null) {
            List<Component> components = componentService.findByUserId(userId);
            List<ComponentOutputDTO> componentsDTO = new ArrayList<>();
            if (components != null) {
                for (Component comp : components) {
                    ComponentOutputDTO compOutputDTO = outputDTOMapper.toDTO(comp);
                    componentsDTO.add(compOutputDTO);
                }

                return ResponseEntity.ok(componentsDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
            }
        } else {
            List<Component> all = componentService.findAll();
            List<ComponentOutputDTO> allDTO = new ArrayList<>();
            for (Component comp : all) {
                ComponentOutputDTO compOutputDTO = outputDTOMapper.toDTO(comp);
                allDTO.add(compOutputDTO);
            }
            return ResponseEntity.ok(allDTO);
        }
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody ComponentInputDTO componentInputDTO) {
        if (componentInputDTO != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);
            if (userByNick != null) {
                Seller sellerByName = sellerService.findByName(componentInputDTO.getSellerName());
                if (sellerByName != null) {
                    String codedPicture = componentInputDTO.getImage64();
                    byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
                    String newFileName = storageService.save(userByNick.getNick() + "_" + componentInputDTO.getImage(), photoBytes);
                    componentInputDTO.setImage(newFileName);
                    Component component = inputDTOMapper.toDomain(componentInputDTO);
                    component.setSeller(sellerByName);
                    component.setUserWhoCreated(userByNick);
                    Component save = componentService.save(component);

                    if (save != null) {
                        ComponentOutputDTO compOutputDTO = outputDTOMapper.toDTO(save);
                        return ResponseEntity.ok(compOutputDTO);
                    } else {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The seller must exist");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The body must not be null");
        }
    }

    @GetMapping("/img/{id}/{filename}")
    public ResponseEntity<?> getFiles(@PathVariable("id") long compId, @PathVariable("filename") String filename) {
        Component byId = componentService.findById(compId);
        if (byId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
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
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        if (id != null) {
            Component byId = componentService.findById(id);
            if (byId != null) {
                ComponentOutputDTO compOutputDTO = outputDTOMapper.toDTO(byId);
                return ResponseEntity.ok(compOutputDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        if (id != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);
            if (userByNick != null) {
                Component byId = componentService.findById(id);
                if (byId != null) {
                    if (byId.getUserWhoCreated().getId() == userByNick.getId()) {
                        boolean ok = componentService.deleteById(id);
                        if (ok) {
                            return ResponseEntity.ok("Component successfully deleted");
                        } else {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not your component");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody ComponentInputDTO componentInputDTO, @PathVariable("id") Long id) {
        if (componentInputDTO != null && id != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);
            if (userByNick != null) {
                Component byId = componentService.findById(id);
                if (byId != null) {
                    if (byId.getUserWhoCreated().getId() == userByNick.getId()) {
                        Seller sellerByName = sellerService.findByName(componentInputDTO.getSellerName());
                        if (sellerByName != null) {
                            String codedPicture = componentInputDTO.getImage64();
                            byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
                            String newFileName = storageService.save(userByNick.getNick() + "_" + componentInputDTO.getImage(), photoBytes);
                            componentInputDTO.setImage(newFileName);
                            Component component = inputDTOMapper.toDomain(componentInputDTO);
                            component.setId(id);
                            component.setSeller(sellerByName);
                            component.setUserWhoCreated(userByNick);
                            component.setUsersWhoWants(byId.getUsersWhoWants());
                            boolean ok = componentService.update(component);
                            if (ok) {
                                return ResponseEntity.ok("Component successfully updated");
                            } else {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                            }
                        } else {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The seller must exist");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not your component");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The component does not exist");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }
    @GetMapping("/searchEbay/{search}")
    public ResponseEntity<?> searchEbay(@PathVariable("search") String search) {
        if (search != null) {
            search = search.replace(" ", "+");
            String url = "https://www.ebay.com/sch/i.html?_nkw="+search;
            String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36";

            Document doc = null;
            try {
                doc = Jsoup.connect(url)
                        .userAgent(userAgent)
                        .get();
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("There Was a Problem with the Request");
            }
            Elements listings = doc.select("div.s-item__info");
            List<ProductEbayDTO> productEbayDTOS= new ArrayList<>();
            for (Element listing : listings) {
                String title = listing.select("div.s-item__title").text();
                String urla = listing.select("a.s-item__link").attr("href");
                String price = listing.select("span.s-item__price").text();

                String details = listing.select("div.s-item__subtitle").text();
                String sellerInfo = listing.select("span.s-item__seller-info-text").text();
                String shippingCost = listing.select("span.s-item__shipping").text();
                String location = listing.select("span.s-item__location").text();
                String sold = listing.select("span.s-item__quantity-sold").text();
                ProductEbayDTO productEbayDTO = new ProductEbayDTO(title, urla, price, details, sellerInfo, shippingCost, location, sold);
                productEbayDTOS.add(productEbayDTO);
            }
                if (!listings.isEmpty()) {
                    return ResponseEntity.ok(productEbayDTOS);
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
    }
    @GetMapping("/searchAmazon/{search}")
    public ResponseEntity<?> searchAmazon(@PathVariable("search") String search) {
        if (search != null) {
            search = search.replace(" ", "+");
            Mono<List<ProductAmazonDTO>> responseMono = this.webClient.get()
                    .uri("/" + search)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<ProductAmazonDTO>>() {});
            log=Logger.getLogger("searchAmazon");
            log.info(responseMono.toString());
            List<ProductAmazonDTO> response = responseMono.block();
            if (response!=null && !response.isEmpty()) {
                return ResponseEntity.ok(response);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The requested components were not found");
    }
}
