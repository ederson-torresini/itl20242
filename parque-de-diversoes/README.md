# Parque de diversões

Os visitantes do parque de diversões, a partir do painel de controle (aplicação Web), enviam comandos para a central de controle que, por sua vez, propagam os comandos para os brinquedos.

Para exemplificar o fluxo da mensagens, a seguir um visitante escolhe o brinquedo `7`e comando `1`:

```mermaid
sequenceDiagram
  actor Usuário
  box Serviços em nuvem
    participant Painel de controle
    participant Broker MQTT
  end
  box Parque
    participant Central de controle
    participant Micro bit
  end
  
  Usuário ->>+ Painel de controle: brinquedo 7, comando 1
  Painel de controle ->>+ Broker MQTT: PUBLISH itl20242/req/7 1
  Broker MQTT ->>+ Central de controle: NOTIFY itl20242/req/7 1
  Central de controle ->> Micro bit: 71
  Central de controle ->>- Broker MQTT: PUBLISH itl20242/res/7 1
  Broker MQTT ->>- Painel de controle: NOTIFY itl20242/res/7 1
  Painel de controle ->>- Usuário: confirmação visual/sonora
```
