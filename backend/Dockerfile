FROM python:3.14-alpine

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

COPY . /usr/src/backend
WORKDIR /usr/src/backend

RUN pip --no-cache-dir install -r requirements.txt

WORKDIR /usr/src/backend/src

ENTRYPOINT [ "uvicorn", "main:app", "--host", "0.0.0.0" ]