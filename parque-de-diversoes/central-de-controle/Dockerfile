FROM python

RUN pip install python-dotenv paho-mqtt
COPY ./central-de-controle/central.py /central.py

CMD ["python", "/central.py"]
