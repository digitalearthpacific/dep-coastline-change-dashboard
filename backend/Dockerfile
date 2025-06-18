FROM python:3.12-slim

COPY ./app /app
COPY ./requirements.txt /app/

WORKDIR /app

RUN pip install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 80

CMD ["fastapi", "run", "/app/main.py", "--port", "80"]


