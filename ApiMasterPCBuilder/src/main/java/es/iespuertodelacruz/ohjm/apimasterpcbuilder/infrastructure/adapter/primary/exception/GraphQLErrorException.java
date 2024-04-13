package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.exception;

import org.springframework.http.HttpStatus;

public class GraphQLErrorException extends RuntimeException {
    private final String message;
    private final HttpStatus status;

    public GraphQLErrorException(String message, HttpStatus status) {
        super(message);
        this.message = message;
        this.status = status;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public HttpStatus getStatus() {
        return status;
    }
}