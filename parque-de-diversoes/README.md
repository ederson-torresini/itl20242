# Parque de diversões

Os visitantes do parque de diversões, a partir do painel de controle (aplicação Web), enviam comandos para a central de controle que, por sua vez, propagam os comandos para os brinquedos.

Para exemplificar o fluxo da mensagens, a seguir dois cenários onde um visitante escolhe o brinquedo `7`e comando `1`:

1. Com o uso de Micro:bit para troca de mensagens:

```mermaid
sequenceDiagram
  actor Usuário
  box Serviços em nuvem
    participant Painel de controle
    participant Broker MQTT
  end
  box Parque
    participant Central de controle
    participant Micro bit A
  end
  box Brinquedo
    participant Micro bit B
    participant Arduino
  end
  
  Usuário ->>+ Painel de controle: brinquedo 7, comando 1
  Painel de controle ->>+ Broker MQTT: PUBLISH itl20242/req/7 1
  Broker MQTT ->>+ Central de controle: NOTIFY itl20242/req/7 1
  Central de controle ->> Micro bit A: (serial) 71
  Micro bit A ->> Micro bit B: (rádio) 71
  Micro bit B ->> Arduino: (I2C) 71
  Central de controle ->>- Broker MQTT: PUBLISH itl20242/res/7 1
  Broker MQTT ->>- Painel de controle: NOTIFY itl20242/res/7 1
  Painel de controle ->>- Usuário: confirmação visual/sonora
```

2. Com o uso de Arduino para troca de mensagens:

```mermaid
sequenceDiagram
  actor Usuário
  box Serviços em nuvem
    participant Painel de controle
    participant Broker MQTT
  end
  box Brinquedo
    participant Arduino
  end
  
  Usuário ->>+ Painel de controle: brinquedo 7, comando 1
  Painel de controle ->>+ Broker MQTT: PUBLISH itl20242/req/7 1
  Broker MQTT ->>+ Arduino: NOTIFY itl20242/req/7 1
  Arduino ->>- Broker MQTT: PUBLISH itl20242/res/7 1
  Broker MQTT ->>- Painel de controle: NOTIFY itl20242/res/7 1
  Painel de controle ->>- Usuário: confirmação visual/sonora
```

O painel de controle está disponível em: https://itl.sj.ifsc.edu.br.
