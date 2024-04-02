package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.PriceHistory;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IPriceHistoryService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.ComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2.ComponentRestControllerV2;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.ComponentEntityMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.PriceHistoryEntityMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigInteger;
import java.time.Instant;
import java.util.List;
import java.util.logging.Logger;

@Service
public class EventRunner {
    Logger log;

    @Autowired
    IComponentService componentService;
    @Autowired
    IPriceHistoryService priceHistoryService;
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    void checkAmazonEbay()  {
        List<Component> all = componentService.findAll();
        for (Component comp : all) {
            log= Logger.getLogger("Check");
            log.info(comp.getName());
            List<Component> amazonSearch  = componentService.searchAmazon(comp.getName());
            List<Component> ebaySearch = componentService.searchEbay(comp.getName());
            log.info("Amazon: "+amazonSearch.get(0).getAmazon_price());
            log.info("Ebay: "+ebaySearch.get(1).getEbay_price());
            if (amazonSearch.size() > 0 ) {
                if (amazonSearch.get(0).getAmazon_price() != comp.getAmazon_price()) {
                    comp.setAmazon_price(amazonSearch.get(0).getAmazon_price());
                }
            }
            if (ebaySearch.size() > 0 ) {
                if (ebaySearch.get(1).getEbay_price() != comp.getEbay_price()) {
                    comp.setEbay_price(ebaySearch.get(1).getEbay_price());
                }
            }
            log.info("Componente precios: "+comp.toString());
            try{
                Component savedComponent = componentService.save(comp);
                componentService.updatePrices(savedComponent.getId(), savedComponent.getAmazon_price(), savedComponent.getEbay_price());

                PriceHistory priceHistory = new PriceHistory();
                priceHistory.setAmazonPrice(savedComponent.getAmazon_price());
                priceHistory.setEbayPrice(savedComponent.getEbay_price());
                priceHistory.setPrice(savedComponent.getPrice());
                BigInteger nowUnixTimestamp = BigInteger.valueOf(Instant.now().getEpochSecond());
                priceHistory.setDate(nowUnixTimestamp);
                priceHistory.setComponent(savedComponent);

                priceHistoryService.saveManual(priceHistory.getAmazonPrice(), savedComponent.getId(), priceHistory.getDate().longValue(), priceHistory.getEbayPrice(), priceHistory.getPrice());
                savedComponent.getPriceHistories().add(priceHistory);
                componentService.save(savedComponent);
            }catch (Exception e){
                log= Logger.getLogger("Error");
                log.info(e.getMessage());
            }
        }
    }
}
