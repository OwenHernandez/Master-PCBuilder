package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IBuildRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.BuildEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.UserEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.UserEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IBuildEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BuildEntityService implements IBuildRepository {

    @Autowired
    IBuildEntityRepository repo;

    BuildEntityMapper mapper;
    public BuildEntityService() {
        mapper = new BuildEntityMapper();
    }


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
        Build res = null;
        if (build != null) {
            BuildEntity be = mapper.toPersistance(build);
            BuildEntity save = repo.save(be);
            res = mapper.toDomain(save);
        }
        return res;
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
        try {//We will need to change it when I do BuildsComponents and Posts
            repo.deleteById(id);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    @Override
    public boolean update(Build build) {
        try {//We will need to change it when I do BuildsComponents and Posts
            BuildEntity be = mapper.toPersistance(build);
            repo.save(be);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    @Override
    public List<Build> findByName(String name) {
        List<Build> res = null;
        if (name != null) {
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
    public List<Build> findByTotalPrice(double totalPrice) {
        List<Build> res = null;
        if (totalPrice != 0) {
            List<BuildEntity> list = repo.findByTotalPrice(totalPrice);
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
    public List<Build> findByUserId(Long userId) {
        List<Build> res = null;
        if (userId != 0) {
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
