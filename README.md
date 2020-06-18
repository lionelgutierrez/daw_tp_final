# Proyecto Final Desarrollo de Aplicaciones Web
<img  widht="200" height="200"  src="images/fiuba.png?raw=true">
<BR>

Autor: Lionel Gutiérrez - 2020

[![Maintenance](images/Maintained_-no-red.svg)](#)
[![Ask Me Anything !](images/Ask-me-anything.svg)](#)
[![Typescript](images/typescipt-blue.svg)](#)
[![Javascript](images/Javascript-blue.svg)](#)
[![Node.JS](images/Node.JS-blue.svg)](#)
[![License](images/License-GPL.svg)](#)


# Introducción
El proyecto es el trabajo final con el cual se concluye la materia de Desarrollo de aplicaciones Web, de la carrera de Especialización en Internet de las Cosas(CEIot), dictada por la FIUBA.
<BR>El objetivo del mismo es simular un conjunto de dispositivos de IOT de un hogar, los cuales pueden apagarse y prenderse desde la interfaz gráfica de la aplicación. Adicionalmente, se puede filtrar el conjunto de dispositivos por su tipo (Lámparas/Persianas/Todos).
<BR>El proyecto se implementa como una SPA, utilizando Typescript para el desarrollo del front-end y node.js para el back-end.
Se utilizarán contenedores y la herramienta docker-compose para el despliegue de la misma.
A continuación, se muestra la pantalla principal del sistema:

![Alt text](/images/pantallaInicial.png?raw=true "Pantalla Inicial")


# Correr la aplicación
Para correr la aplicación es necesario ejecutar el siguiente comando:
```sh
docker-compose up
```

Si la ejecución no generó ningún inconveniente, en ​[http://localhost:8000](http://localhost:8000) se debería ver la
aplicación corriendo y en [http://localhost:8085](http://localhost:8085) se debería poder acceder a PHPMyAdmin.
Para detener toda la aplicación ejecutar el comando siguiente.

```sh
docker-compose down
```

# Funcionalidades / Instructivo de uso

El proyecto cuenta con una pantalla inicial en la cual se ven, por defecto, todos los dispositivos disponibles.

![Alt text](/images/pantallaInicial.png?raw=true "Pantalla Inicial")

Para filtrar los datos, se puede hacer click sobre los botones señalados en la imagen

![Alt text](/images/botonesFiltro.png?raw=true "Filtro con Botones")

Por ejemplo, al hacer click en el botón Lamparas el sistema muestra solo las lámparas

![Alt text](/images/botonLampara.png?raw=true "Filtro con Boton Lámpara")

Adicionalmente la aplicación permite modificar el estado de los dispositivos, para ello, se deben utilizar los switches señalados en la imagen

![Alt text](/images/switches.png?raw=true "Switches de la aplicación")

De este modo, por ejemplo, al modificar el switch de la lámpara 1, estaremos apagando la misma

![Alt text](/images/lampara1Off.png?raw=true "Lámpara 1 Off")

# Detalles técnicos de la aplicación
A continuación, se detalla la estructura de la aplicación y las configuraciones utilizadas, junto a los lenguajes y herramientas utilizadas en el proyecto.

## Estructura de Directorios de la aplicación


    .
    ├── css                          # Archivos css de materialize para los estilos del front-end   
    ├── db                           # Directorio para la base de datos del proyecto
    ├── doc                          # Carpeta con notas y configuraciones, comandos rapidos
    ├── images                       # Imágenes del proyecto y para la documentación
    ├── js                           # Código Javascript del front-end proyecto, lógica de negocio y presentación de la SPA
    ├── src                          # Código fuente Typescript del proyecto, que se compila a los archivos js de la carpeta /js
    ├── ws                           # Código del backend, implementado como una API Rest en node.js
    ├── index.html                   # Página principal del proyecto (SPA)
    ├── README.md                    # Readme del proyecto con documentación y guías para ejecución del proyecto
    ├── run_phpadmin.sh              # Script para levantar contenedor docker con phpMyAdmin
    ├── serve_node_app_net.sh        # Script para levantar contenedor docker con node, para levantar el back-end
    └── start_mysql.sh               # Script para levantar contenedor docker con el servidor de base de datos mysql

## Funcionamiento / capas de la aplicación

La aplicación se implementa como una SPA.
<BR>Se cuenta con un front-end, encargado de gestionar una lista de dispositivos y de brindar la funcionalidad de modificar el estado de los dispositivos. El front-end se implementa como un framework y un conjunto de clases en Javascript, cuyo código se encuentra dentro de la carpeta JS. 
<BR>Para obtener el listado de dispositivos y modificar el estado de los mismos, el sistema cuenta con un back-end, implementado como una API Rest en Node.JS. El mismo se encuentra dentro de la carpeta WS, implementada en el archivo index.js.
<BR>La información de los dispositivos se almacena en una base de datos mysql. La misma se accede desde el back-end, para lo cual están configurados los datos de conexión dentro de la carpeta WS/mysql, dentro del archivo index.js


## Configuración de docker-compose

Para los detalles de configuración particulares, referirse al archivo [docker-compose.yml](docker-compose.yml) 

La herramienta levanta 3 contenedores y un servicio de red entre los servicios para la ejecución:

* mysql-server: una instancia de mysql server, que almacena la información de los dispositivos.
* phpmyadmin: una instancia de phpMyAdmin, para poder consultar la base de datos mysql.
* node-app: una instancia de Node, que se encarga de servir los archivos estáticos y archivos JS del front-end, y de servir el back-end (API de Dispositivos).
* mysql-net: red para la comunicación de los contenedores.

## Ejecución con docker desde línea de comando
Se puede ejecutar el proyecto sin utilizar docker-compose. Para ellos se utilizan los 3 scripts que se encuentran en el directorio raíz.
Los pasos a realizar son:

1- Ejecutar
```sh
docker stop $(docker ps -a -q)
```
Esto detiene todos los contenedores en ejecución

2 -Ejecutar
```sh
docker network ls | grep mysql-net 
```
Si no se muestran resultados significa que no está creada la interfaz de red que conecta los contenedores, se debe crear ejecutando
```sh
docker network create --driver bridge mysql-net
```
3- Ejecutar
```sh
 ./start_mysql.sh mysql-net "$PWD"/db                       
```
Este paso levanta la base de datos, utilizando la información de la carpeta ./db para generar la base de datos y la red configurada anteriormente

4- Ejecutar
```sh
  ./run_phpadmin.sh mysql-net mysql-server 8085
```

Este paso levanta PHPMyAdmin, para lo cual le indicamos la red a utilizar, el contenedor que tiene la base de datos y el puerto en el cual se levantará el servicio. En este caso podemos acceder al mismo desde:​ http://localhost:8085

5- Ejecutar

```sh
  ./serve_node_app_net.sh "$PWD" ws/index.js 8000 mysql-net  
```
Este paso levanta la aplicación, para lo cual se utiliza un servidor express. Le indicamos el directorio base a servir (PWD) y cuál es el archivo o script inicial de la aplicación (ws/index.js). Además, le indicamos el puerto en el que se levantará la aplicación y la red a utilizar para comunicarse con la base de datos. Podemos acceder a la aplicación desde: http://localhost:8000

## Imágenes docker utilizadas - configuraciones

Para las imágenes de docker utilizadas en la solución se utilizan los siguientes parámetros de configuración:

### MySQL:  

- Modo de invocación:   ./start_mysql.sh PARAM1 PARAM2 
    <BR>Por ejemplo:    ./start_mysql.sh mysql-net "$PWD"/db 
- Nombre de la imagen:  mysql:5.7
- Nombre contenedor:    mysql-server
- Network:              PARAM1 (mysql-net)
- Variables de entorno: MYSQL_ROOT_PASSWORD=userpass (password de root)
- Puertos:              3306
- Volúmenes:            PARAM2/data: directorio donde se aloja la DB
                        PARAM2/dumps: información para generación de DB inicial


### PHPMyAdmin:  

- Modo de invocación:   ./run_phpadmin.sh PARAM1 PARAM2 PARAM3 
    <BR>Por ejemplo:    ./run_phpadmin.sh mysql-net mysql-server 8085 
- Nombre de la imagen:  phpmyadmin/phpmyadmin
- Nombre contenedor:    phpadmin
- Network:              PARAM1 (mysql-net)
- Variables de entorno: PMA_HOST=PARAM2(mysql-server)). se le pasa como variable de entorno el nombre del contenedor de mysql.
- Puertos:              Bindea el puerto 80 del contenedor con el puerto indicado en PARAM3 (8005)
- Volúmenes:            N/A

### Node App:   

- Modo de invocación:   ./serve_node_app_net.sh PARAM1 PARAM2 PARAM3 PARAM4
    <BR>Por ejemplo:    ./serve_node_app_net.sh "$PWD" ws/index.js 8000 mysql-net
- Nombre de la imagen:  abassi/nodejs-server:10.0-dev
- Nombre contenedor:    nodejs-container
- Network:              PARAM4 (mysql-net)
- Variables de entorno: N/A
- Puertos:              Bindea el puerto 3000 del contenedor con el puerto indicado en el PARAM3 (8000)
- Volúmenes:            Compartir el directorio con el código fuente en el host (PARAM1)
                        al directorio /home/node/app del contenedor.
- nodemon:              herramienta que permite redeploy ante cambios en el código. Escucha cambios según PARAM2



# Contribuir
Para contribuir realizar un pull request con las sugerencias.

# Licencia
GPL
