# Acortador de enlaces en AWS

Aplicación web para acortar enlaces con Amazon S3, Amazon DynamoDB y Amazon EC2.

## Arquitectura

- **Amazon S3**: aloja la interfaz web (HTML, CSS y JavaScript).
- **Amazon EC2**: ejecuta el backend FastAPI con Uvicorn, administrado con systemd.
- **Amazon DynamoDB**: tabla `short-links` con `short_code` (UUID) como clave de partición, `original_url` y `created_at`.
- **IAM**: la EC2 usa un rol con permisos `PutItem` y `GetItem` solo sobre la tabla, sin claves en el código.

## Endpoints

- `POST /shorten`: crea un enlace corto.
- `GET /{short_code}`: redirige con 307 a la URL original, o devuelve 404.
- `GET /urls/{short_code}`: devuelve la información del enlace en JSON.

## Variables de entorno

Ver `backend/.env.example`.

## Ejecución local

    cd backend
    python -m venv venv
    pip install -r requirements.txt
    uvicorn app.main:app --reload

## Despliegue

- Interfaz: http://acortador-enlaces-jimmy-2026.s3-website-us-east-1.amazonaws.com/
- API: http://98.81.149.232:8000/docs#/