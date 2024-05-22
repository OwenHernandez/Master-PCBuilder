package es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Logger;

@Service
public class FileStorageService {
    private final Path root = Paths.get(System.getProperty("user.home"), "img");

    private Path getFilenameFree(String filename){
        Path path = this.root.resolve(filename);
        String name="";
        String extension = "";
        if( filename.contains(".")) {
            extension = filename.substring(filename.lastIndexOf(".") + 1);
            name = filename.substring(0, filename.length() -
                    extension.length() -1);

        }
        else {
            name = filename;
        }
        int contador=1;
        while(Files.exists(path)) {
            String nuevoNombre = name + "_"+contador;
            nuevoNombre += "."+extension;
            path = this.root.resolve(nuevoNombre);
            contador++;
        }
        return(path);
    }
    public String save(String fileName, byte[] dataFile) {
        Logger logger = Logger.getLogger("debug");
        try {
            Files.createDirectories(root);
            logger.info("Directory created at: " + root.toAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("The directory could not be created");
        }

        try {
            Path filenameFree = getFilenameFree(fileName);
            logger.info("File name free: " + filenameFree.toAbsolutePath());
            Files.write(filenameFree,dataFile);
            logger.info("File saved at: " + filenameFree.toAbsolutePath());
            return filenameFree.getFileName().toString();
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists");
            }
            throw new RuntimeException(e.getMessage());
        }

    }

    public String save(MultipartFile file) {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("The directory could not be created");
        }
        try {
            Path filenameFree = getFilenameFree(file.getOriginalFilename());
            Files.copy(file.getInputStream(),filenameFree);
            return filenameFree.getFileName().toString();
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists");

            }

            throw new RuntimeException(e.getMessage());

        }

    }

    public Resource get(String filename) throws RuntimeException {
        try {
            Path pathForFilename = root.resolve(filename);

            Resource resource = new UrlResource(pathForFilename.toUri());
            if( resource.exists()) {
                return resource;
            }else {
                throw new RuntimeException("Cannot access: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
