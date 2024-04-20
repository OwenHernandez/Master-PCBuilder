package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.exception;

import graphql.GraphQLError;
import graphql.execution.DataFetcherExceptionHandlerParameters;
import graphql.execution.DataFetcherExceptionHandlerResult;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.stereotype.Component;
import org.springframework.graphql.execution.ErrorType;

import java.util.concurrent.CompletableFuture;

@Component
public class GraphQLErrorHandler extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        GraphQLError error;
        if (ex instanceof GraphQLErrorException) {
            GraphQLErrorException gqlEx = (GraphQLErrorException) ex;
            // Aquí determinas el tipo de ErrorType basado en el estado HTTP de tu excepción personalizada
            // Por ejemplo, un mapeo básico podría ser:
            switch (gqlEx.getStatus()) {
                case NOT_FOUND:
                    error = GraphQLError.newError().message(gqlEx.getMessage()).errorType(ErrorType.NOT_FOUND).build();
                    break;
                case BAD_REQUEST:
                    error = GraphQLError.newError().message(gqlEx.getMessage()).errorType(ErrorType.BAD_REQUEST).build();
                    break;
                default:
                    error = GraphQLError.newError().message("Internal Server Error").errorType(ErrorType.INTERNAL_ERROR).build();
            }
        } else {
            // Para cualquier otro tipo de excepción, puedes manejarlo de manera genérica o agregar más lógica específica
            error = GraphQLError.newError().message("Error: " + ex.getMessage()).errorType(ErrorType.INTERNAL_ERROR).build();
        }

        return error;
    }
}