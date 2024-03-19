package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IBuildRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IComponentRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.BuildEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.ComponentEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.UserEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IBuildComponentEntityRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IBuildEntityRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IComponentEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ComponentEntityService implements IComponentRepository {

    @Autowired
    IComponentEntityRepository repo;

    @Autowired
    IBuildComponentEntityRepository bceRepo;

    private ComponentEntityMapper mapper = new ComponentEntityMapper();

    UserEntityMapper userMapper = new UserEntityMapper();

    @Override
    public List<Component> findAll() {
        List<Component> res = new ArrayList<>();
        List<ComponentEntity> all = repo.findAll();

        for (ComponentEntity ce : all) {
            Component c = mapper.toDomain(ce);
            c.setUserWhoCreated(userMapper.toDomain(ce.getUser()));
            res.add(c);
        }

        return res;
    }

    @Override
    public Component save(Component component) {
        try {
            Component res = null;
            if (component != null) {
                ComponentEntity ce = mapper.toPersistance(component);
                ce.setUser(userMapper.toPersistance(component.getUserWhoCreated()));
                ComponentEntity save = repo.save(ce);
                res = mapper.toDomain(save);
                res.setUserWhoCreated(userMapper.toDomain(ce.getUser()));
            }
            return res;
        } catch (RuntimeException | ParseException e) {
            return null;
        }
    }

    @Override
    public Component findById(Long id) {
        Component component = null;
        if (id != null) {
            Optional<ComponentEntity> opt = repo.findById(id);
            if (opt.isPresent()) {
                ComponentEntity componentEntity = opt.get();
                component = mapper.toDomain(componentEntity);
                component.setUserWhoCreated(userMapper.toDomain(opt.get().getUser()));
            }
        }
        return component;
    }

    @Override
    public List<Component> findByUserId(Long userId) {
        List<Component> res = null;
        if (userId != null) {
            res= new ArrayList<>();
            List<ComponentEntity> list = repo.findByUserId(userId);
            if (list != null) {
                for (ComponentEntity ce : list) {
                    Component c = mapper.toDomain(ce);
                    c.setUserWhoCreated(userMapper.toDomain(ce.getUser()));
                    res.add(c);
                }
            }
        }
        return res;
    }

    @Override
    public boolean deleteById(long id) {
        try {
            Optional<ComponentEntity> byId = repo.findById(id);

            if (byId.isPresent()) {
                ComponentEntity comp = byId.get();
                if (comp.getBuildsComponents() != null) {
                    for (BuildComponentEntity bce : comp.getBuildsComponents()) {
                        bceRepo.delete(bce);
                    }
                }
                if (comp.getUsersWhoWants() != null && !comp.getUsersWhoWants().isEmpty()) {
                    comp.getUsersWhoWants().clear();
                }
                repo.delete(comp);
                return true;
            } else {
                return false;
            }
        } catch (RuntimeException e) {
            return false;
        }
    }

    @Override
    public boolean update(Component component) {
        try {
            Optional<ComponentEntity> byId = repo.findById(component.getId());
            if (byId.isPresent()) {
                ComponentEntity ce = mapper.toPersistance(component);
                ce.setUser(userMapper.toPersistance(component.getUserWhoCreated()));
                if (component.getUsersWhoWants() != null && !component.getUsersWhoWants().isEmpty()) {
                    ce.setUsersWhoWants(new ArrayList<>());
                    for (User user : component.getUsersWhoWants()) {
                        ce.getUsersWhoWants().add(userMapper.toPersistance(user));
                    }
                }
                repo.save(ce);

                return true;
            } else {
                return false;
            }
        } catch (RuntimeException | ParseException e) {
            return false;
        }
    }

    @Override
    public List<Component> findByName(String name) {
        List<Component> res = null;
        if (name != null) {
            res= new ArrayList<>();
            List<ComponentEntity> list = repo.findByName(name);
            if (list != null) {
                for (ComponentEntity ce : list) {
                    Component c = mapper.toDomain(ce);
                    res.add(c);
                }
            }
        }
        return res;
    }

    @Override
    public List<Component> findByPrice(double price) {
        List<Component> res = null;
        if (price != 0) {
            List<ComponentEntity> list = repo.findByPrice(price);
            if (list != null) {
                for (ComponentEntity ce : list) {
                    Component c = mapper.toDomain(ce);
                    res.add(c);
                }
            }
        }
        return res;
    }

    @Override
    public List<Component> findBySellerId(Long sellerId) {
        List<Component> res = null;
        if (sellerId != 0) {
            res = new ArrayList<>();
            List<ComponentEntity> list = repo.findBySellerId(sellerId);
            if (list != null) {
                for (ComponentEntity ce : list) {
                    Component c = mapper.toDomain(ce);
                    res.add(c);
                }
            }
        }
        return res;
    }

}
