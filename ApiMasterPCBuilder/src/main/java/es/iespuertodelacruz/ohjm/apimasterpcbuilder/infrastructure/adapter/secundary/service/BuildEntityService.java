package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IBuildRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.BuildEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.ComponentEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.UserEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IBuildComponentEntityRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IBuildEntityRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IPostEntityRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BuildEntityService implements IBuildRepository {

    @Autowired
    private IBuildEntityRepository repo;

    @Autowired
    private IBuildComponentEntityRepository bceRepo;

    @Autowired
    private IPostEntityRepository postRepo;

    private final BuildEntityMapper mapper = new BuildEntityMapper();

    @Override
    @Transactional
    public List<Build> findAll() {
        List<Build> res = new ArrayList<>();
        List<BuildEntity> all = repo.findAll();

        for (BuildEntity be : all) {
            Build b = mapper.toDomain(be);
            res.add(b);
        }

        return res;
    }

    @Override
    @Transactional
    public Build save(Build build) {
        try {
            BuildEntity be = mapper.toPersistence(build);
            Optional<BuildEntity> findOpt = repo.findById(build.getId());
            if (!findOpt.isPresent()) {
                BuildEntity save = repo.save(be);
                if (be.getBuildsComponents() != null && !be.getBuildsComponents().isEmpty()) {
                    be.getBuildsComponents().forEach(bce -> bce.setBuild(save));
                    bceRepo.saveAll(be.getBuildsComponents());
                    save.setBuildsComponents(be.getBuildsComponents());
                } else {
                    save.setBuildsComponents(new ArrayList<>());
                }
                return mapper.toDomain(save);
            } else {
                throw new RuntimeException("The build must not exist");
            }
        } catch (RuntimeException | ParseException e) {
            return null;
        }
    }

    @Override
    @Transactional
    public Build findById(Long id) {
        Build build = null;
        if (id != null) {
            Optional<BuildEntity> opt = repo.findById(id);
            if (opt.isPresent()) {
                BuildEntity buildEntity = opt.get();
                build = mapper.toDomain(buildEntity);
            }
        }
        return build;
    }

    @Override
    @Transactional
    public boolean deleteById(long id) {
        Optional<BuildEntity> byId = repo.findById(id);
        if (byId.isPresent()) {
            BuildEntity be = byId.get();
            if (be.getBuildsComponents() != null && !be.getBuildsComponents().isEmpty()) {
                bceRepo.deleteAll(be.getBuildsComponents());
            }
            if (be.getPosts() != null && !be.getPosts().isEmpty()) {
                throw new RuntimeException("The build has posts");
            }
            repo.deleteById(id);
        } else {
            return false;
        }

        return true;
    }

    @Override
    @Transactional
    public boolean update(Build build) {
        try {
            Optional<BuildEntity> opt = repo.findById(build.getId());
            if (opt.isPresent()) {
                BuildEntity optGet = opt.get();
                if (optGet.getBuildsComponents() != null && !optGet.getBuildsComponents().isEmpty()) {
                    bceRepo.deleteAll(optGet.getBuildsComponents());
                }
                BuildEntity be = mapper.toPersistence(build);
                BuildEntity save = repo.save(be);

                if (be.getBuildsComponents() != null && !be.getBuildsComponents().isEmpty()) {
                    be.getBuildsComponents().forEach(bce -> bce.setBuild(save));
                    bceRepo.saveAll(be.getBuildsComponents());
                    save.setBuildsComponents(be.getBuildsComponents());
                } else {
                    save.setBuildsComponents(new ArrayList<>());
                }
                return true;
            } else {
                return false;
            }
        } catch (ParseException e) {
            return false;
        }
    }

    @Override
    @Transactional
    public List<Build> findByName(String name) {
        List<Build> res = null;
        if (name != null) {
            res = new ArrayList<>();
            List<BuildEntity> list = repo.findByName(name);
            if (list != null) {
                for (BuildEntity be : list) {
                    Build b = mapper.toDomain(be);
                    res.add(b);
                }
            }
        }
        return res;
    }

    @Override
    @Transactional
    public List<Build> findByUserId(Long userId) {
        List<Build> res = null;
        if (userId != null) {
            res = new ArrayList<>();
            List<BuildEntity> list = repo.findByUserId(userId);
            if (list != null) {
                for (BuildEntity be : list) {
                    Build b = mapper.toDomain(be);
                    res.add(b);
                }
            }
        }
        return res;
    }
}
