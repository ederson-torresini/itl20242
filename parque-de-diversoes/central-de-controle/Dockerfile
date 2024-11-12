FROM python:3

COPY ./central-de-controle/requirements.txt ./central-de-controle/central.py /
RUN pip install -r /requirements.txt

CMD ["python", "/central.py"]
