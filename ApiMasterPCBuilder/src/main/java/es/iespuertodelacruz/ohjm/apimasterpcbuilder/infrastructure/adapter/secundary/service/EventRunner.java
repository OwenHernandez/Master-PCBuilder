package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.service;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.ComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2.ComponentRestControllerV2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.logging.Logger;

@Service
public class EventRunner {
    Logger log;

    @Autowired
    IComponentService componentService;

    @Scheduled(cron = " 0 0 * * * *")
    private void checkAmazonEbay()  {
        List<Component> all = componentService.findAll();
        for (Component comp : all) {
            List<Component> amazonSearch  = componentService.searchAmazon(comp.getName());
            List<Component> ebaySearch = componentService.searchEbay(comp.getName());
            if (amazonSearch.size() > 0 ) {
                if (amazonSearch.get(0).getAmazon_price() != comp.getAmazon_price()) {
                    log= Logger.getLogger("Amazon");
                    log.info("DISTINTO");
                    comp.setAmazon_price(amazonSearch.get(0).getPrice());
                    componentService.update(comp);
                }
            }
            if (ebaySearch.size() > 0 ) {
                if (ebaySearch.get(1).getEbay_price() != comp.getEbay_price()) {
                    log= Logger.getLogger("Amazon");
                    log.info("DISTINTO");
                    comp.setEbay_price(ebaySearch.get(1).getPrice());
                    componentService.update(comp);
                }
            }
        }
    }
}
