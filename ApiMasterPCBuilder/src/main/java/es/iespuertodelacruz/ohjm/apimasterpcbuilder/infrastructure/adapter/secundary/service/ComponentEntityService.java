package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.secundary.IComponentRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ProductAmazonDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.ComponentEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.UserEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.BuildComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.persistence.ComponentEntity;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IBuildComponentEntityRepository;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.repository.IComponentEntityRepository;
import jakarta.transaction.Transactional;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class ComponentEntityService implements IComponentRepository {
    private final WebClient webClient;
    Logger log;

    @Autowired
    public ComponentEntityService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://fastapi:8000").build();
    }

    @Value("${fastapi.apikey}")
    private String apiKey;

    @Autowired
    private IComponentEntityRepository repo;

    @Autowired
    private IBuildComponentEntityRepository bceRepo;

    private final ComponentEntityMapper mapper = new ComponentEntityMapper();

    private final UserEntityMapper userMapper = new UserEntityMapper();

    @Override
    @Transactional
    public List<Component> findAll() {
        List<Component> res = new ArrayList<>();
        List<ComponentEntity> all = repo.findAll();

        for (ComponentEntity ce : all) {
            Component c = mapper.toDomain(ce);
            c.setUserWhoCreated(userMapper.toDomain(ce.getUser(), new HashSet<Long>(), new HashSet<Long>(), "comp"));
            res.add(c);
        }

        return res;
    }

    @Override
    @Transactional
    public Component save(Component component) {
        try {
            Component res = null;
            if (component != null) {
                ComponentEntity ce = mapper.toPersistence(component);
                ce.setUser(userMapper.toPersistence(component.getUserWhoCreated(), new HashSet<>(), new HashSet<>(), "comp"));
                ComponentEntity save = repo.save(ce);
                res = mapper.toDomain(save);
                res.setUserWhoCreated(userMapper.toDomain(ce.getUser(), new HashSet<Long>(), new HashSet<Long>(), "comp"));
            }
            return res;
        } catch (ParseException e) {
            throw new RuntimeException("Error while parsing the component");
        }
    }

    @Override
    @Transactional
    public Component findById(Long id) {
        Component component = null;
        if (id != null) {
            Optional<ComponentEntity> opt = repo.findById(id);
            if (opt.isPresent()) {
                ComponentEntity componentEntity = opt.get();
                component = mapper.toDomain(componentEntity);
                component.setUserWhoCreated(userMapper.toDomain(opt.get().getUser(), new HashSet<Long>(), new HashSet<Long>(), "comp"));
            }
        }
        return component;
    }

    @Override
    @Transactional
    public List<Component> findByUserId(Long userId) {
        List<Component> res = null;
        if (userId != null) {
            res = new ArrayList<>();
            List<ComponentEntity> list = repo.findByUserId(userId);
            if (list != null) {
                for (ComponentEntity ce : list) {
                    Component c = mapper.toDomain(ce);
                    c.setUserWhoCreated(userMapper.toDomain(ce.getUser(), new HashSet<Long>(), new HashSet<Long>(), "comp"));
                    res.add(c);
                }
            }
        }
        return res;
    }

    @Override
    @Transactional
    public boolean deleteById(long id) {
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
    }

    @Override
    @Transactional
    public boolean update(Component component) {
        try {
            Optional<ComponentEntity> byId = repo.findById(component.getId());
            if (byId.isPresent()) {
                ComponentEntity ce = mapper.toPersistence(component);
                ce.setUser(userMapper.toPersistence(component.getUserWhoCreated(), new HashSet<>(), new HashSet<>(), "comp"));
                if (component.getUsersWhoWants() != null && !component.getUsersWhoWants().isEmpty()) {
                    ce.setUsersWhoWants(new ArrayList<>());
                    for (User user : component.getUsersWhoWants()) {
                        ce.getUsersWhoWants().add(userMapper.toPersistence(user, new HashSet<>(), new HashSet<>(), "comp"));
                    }
                }
                repo.save(ce);
                return true;
            } else {
                return false;
            }
        } catch (ParseException e) {
            throw new RuntimeException("Error while parsing the component");
        }
    }

    @Override
    @Transactional
    public List<Component> findByName(String name) {
        List<Component> res = null;
        if (name != null) {
            res = new ArrayList<>();
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
    @Transactional
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
    @Transactional
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

    public List<Component> searchEbay(String name) {
        name = name.replace(" ", "+");
        String url = "https://www.ebay.com/sch/i.html?_nkw=" + name;
        String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36";

        Document doc = null;
        try {
            doc = Jsoup.connect(url)
                    .userAgent(userAgent)
                    .get();
        } catch (IOException e) {
            throw new RuntimeException("There Was a Problem with the Request");
        }
        Elements listings = doc.select("div.s-item__info");
        List<Component> productEbayDTOS = new ArrayList<>();
        for (Element listing : listings) {
            String title = listing.select("div.s-item__title").text();
            String price = listing.select("span.s-item__price").text();
            String monetaryValueRegex = "^\\$?\\d+(\\.\\d{1,2})?$";
            if (price != null && price.matches(monetaryValueRegex)) {
                Component component = new Component();
                component.setName(title);
                price = price.replace("$", "");
                price = price.replace(",", "");
                price = price.replaceAll("\\s*to.*", "");
                String[] parts = price.split(" ");

                try {
                    double parsedPrice = Double.parseDouble(parts[0]);
                    component.setEbay_price(parsedPrice);
                    productEbayDTOS.add(component);
                } catch (NumberFormatException e) {
                    // Handle the parsing error or ignore this component
                }
            }
        }
        return productEbayDTOS;

    }


    public List<Component> searchAmazon(String name) {
        log = Logger.getLogger("amazon");
        log.info("API Key: " + apiKey);
        name = name.replace(" ", "+");
        Mono<List<ProductAmazonDTO>> responseMono = this.webClient.get()
                .uri("http://127.0.0.1:8000/" + name)
                .header("access_token", apiKey)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<ProductAmazonDTO>>() {
                });
        List<ProductAmazonDTO> block = responseMono.block();
        List<Component> components = new ArrayList<>();
        for (ProductAmazonDTO productAmazonDTO : block) {
            if (productAmazonDTO.getPrice() != null) {
                Component component = new Component();
                component.setName(productAmazonDTO.getTile());
                String price = productAmazonDTO.getPrice();

                price = price.replace("$", "");
                price = price.replace(",", "");
                log = Logger.getLogger("amazon");
                component.setAmazon_price(Double.parseDouble(price));
                components.add(component);
            }
        }
        return components;
    }

    @Override
    @Transactional
    public void updatePrices(Long id, double amazonPrice, double ebayPrice) {
        Optional<ComponentEntity> byId = repo.findById(id);
        if (byId.isPresent()) {
            repo.updatePrices(id, amazonPrice, ebayPrice);
        } else {
            throw new RuntimeException("Component Not Found");
        }
    }
}
