package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.config;

import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {

    @Bean
    public MongoTemplate mongoTemplate() {
        String uri = "mongodb://root:1q2w3e4r@mongodb:27017/master?authSource=admin";
        return new MongoTemplate(new SimpleMongoClientDatabaseFactory(uri));
    }
}
