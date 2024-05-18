# Utiliza una imagen base oficial de Python
FROM python:3.9-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /code

# Copia los archivos de requisitos primero para aprovechar la caché de Docker
COPY requirements.txt .

# Instala las dependencias del proyecto
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copia el resto del código fuente y archivos de configuración necesarios al contenedor
# Ten en cuenta que estamos asumiendo que todos tus archivos Python y YAML, junto con rotating_ip.txt, están en el directorio raíz del proyecto.
COPY main.py rotating_ip.txt search_results.yml selectors.yml ./

#ejecutar la aplicación usando uvicorn. Asume que main.py es tu archivo principal
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]
