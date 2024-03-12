package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IBuildRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.BuildEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.ComponentEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IBuildComponentEntityRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IBuildEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BuildEntityService implements IBuildRepository {

    @Autowired
    IBuildEntityRepository repo;

    @Autowired
    IBuildComponentEntityRepository bceRepo;

    BuildEntityMapper mapper = new BuildEntityMapper();

    ComponentEntityMapper compMapper = new ComponentEntityMapper();

    @Override
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
    public Build save(Build build) {
        try {
            BuildEntity be = mapper.toPersistence(build);
            Optional<BuildEntity> findOpt = repo.findById(build.getId());
            if (!findOpt.isPresent()) {
                BuildEntity save = repo.save(be);
                if (be.getBuildsComponents() != null) {
                    for (int i = 0; i < build.getBuildsComponents().size(); i++) {
                        BuildComponent bc = build.getBuildsComponents().get(i);
                        BuildComponentEntity bce = be.getBuildsComponents().get(i);
                        bce.setComponent(compMapper.toPersistance(bc.getComponent()));
                        bce.setBuild(save);
                        bceRepo.save(bce);
                        save.getBuildsComponents().add(bce);
                    }
                } else {
                    save.setBuildsComponents(new ArrayList<>());
                }
                Build domain = mapper.toDomain(save);
                domain.setBuildsComponents(build.getBuildsComponents());
                return domain;
            } else {
                throw new RuntimeException("The build must not exist");
            }
        } catch (RuntimeException | ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
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
    public boolean deleteById(long id) {
        try {//We will need to change it when I do Posts
            Optional<BuildEntity> byId = repo.findById(id);
            if (byId.isPresent()) {
                BuildEntity be = byId.get();
                if (be.getBuildsComponents() != null || !be.getBuildsComponents().isEmpty()) {
                    for (BuildComponentEntity bce : be.getBuildsComponents()) {
                        bceRepo.delete(bce);
                    }
                }
                repo.deleteById(id);
            } else {
                return false;
            }

            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    @Override
    public boolean update(Build build) {
        try {//We will need to change it when I do Posts
            Optional<BuildEntity> opt = repo.findById(build.getId());
            if (!opt.isEmpty()) {
                BuildEntity optGet = opt.get();
                if (optGet.getBuildsComponents() != null || !optGet.getBuildsComponents().isEmpty()) {
                    for (BuildComponentEntity bce : optGet.getBuildsComponents()) {
                        bceRepo.delete(bce);
                    }
                }
                BuildEntity be = mapper.toPersistence(build);
                BuildEntity save = repo.save(be);

                if (be.getBuildsComponents() != null) {
                    for (int i = 0; i < build.getBuildsComponents().size(); i++) {
                        BuildComponent bc = build.getBuildsComponents().get(i);
                        BuildComponentEntity bce = be.getBuildsComponents().get(i);
                        bce.setComponent(compMapper.toPersistance(bc.getComponent()));
                        bce.setBuild(save);
                        bceRepo.save(bce);
                        save.getBuildsComponents().add(bce);
                    }
                } else {
                    save.setBuildsComponents(new ArrayList<>());
                }
                return true;
            } else {
                return false;
            }
        } catch (RuntimeException | ParseException e) {
            return false;
        }
    }

    @Override
    public List<Build> findByName(String name) {
        List<Build> res = null;
        if (name != null) {
            res = new ArrayList<>();
            List<BuildEntity> list = repo.findByName(name);
            if (list != null) {
                for (BuildEntity be : list) {
                    Build b = mapper.toDomain(be);
                    for (int i = 0; i < b.getBuildsComponents().size(); i++) {
                        BuildComponent bc = b.getBuildsComponents().get(i);
                        BuildComponentEntity bce = be.getBuildsComponents().get(i);
                        bc.setComponent(compMapper.toDomain(bce.getComponent()));
                    }
                    res.add(b);
                }
            }
        }
        return res;
    }

    @Override
    public List<Build> findByTotalPrice(double totalPrice) {
        List<Build> res = null;
        if (totalPrice != 0) {
            List<BuildEntity> list = repo.findByTotalPrice(totalPrice);
            if (list != null) {
                for (BuildEntity be : list) {
                    Build b = mapper.toDomain(be);
                    for (int i = 0; i < b.getBuildsComponents().size(); i++) {
                        BuildComponent bc = b.getBuildsComponents().get(i);
                        BuildComponentEntity bce = be.getBuildsComponents().get(i);
                        bc.setComponent(compMapper.toDomain(bce.getComponent()));
                    }
                    res.add(b);
                }
            }
        }
        return res;
    }

    @Override
    public List<Build> findByUserId(Long userId) {
        List<Build> res = null;
        if (userId != null) {
            res = new ArrayList<>();
            List<BuildEntity> list = repo.findByUserId(userId);
            if (list != null) {
                for (BuildEntity be : list) {
                    Build b = mapper.toDomain(be);
                    for (int i = 0; i < b.getBuildsComponents().size(); i++) {
                        BuildComponent bc = b.getBuildsComponents().get(i);
                        BuildComponentEntity bce = be.getBuildsComponents().get(i);
                        bc.setComponent(compMapper.toDomain(bce.getComponent()));
                    }
                    res.add(b);
                }
            }
        }
        return res;
    }
}
