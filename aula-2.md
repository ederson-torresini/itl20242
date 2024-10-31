# Aula 2 

Aprender sobre comunicação via rádio.

## Experimento 2.1: dia das bruxas

Jogo para ser jogado em várias equipes. Há 3 tipos de magia, e 4 canais de comunicação. Quando houver "sintonia" entre os dispositivos, a magia é enviada. Ao final, ganha quem receber mais magias.

```python
def on_received_number(receivedNumber):
    global magiasRecebidas
    magias(receivedNumber)
    magiasRecebidas += 1
radio.on_received_number(on_received_number)

def on_button_pressed_a():
    global canal
    canal += 1
    if canal == 5:
        canal = 1
    radio.set_group(canal)
    basic.show_number(canal)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_gesture_shake():
    radio.send_number(magia)
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

def magias(num: number):
    if num == 1:
        basic.show_icon(IconNames.HEART)
    if num == 2:
        basic.show_icon(IconNames.STICK_FIGURE)
    if num == 3:
        basic.show_icon(IconNames.SNAKE)

def on_button_pressed_ab():
    basic.show_number(magiasRecebidas)
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global magia
    magia += 1
    if magia == 4:
        magia = 1
    basic.show_number(magia)
input.on_button_pressed(Button.B, on_button_pressed_b)

canal = 0
magiasRecebidas = 0
magia = 0
magia = 1
magiasRecebidas = 0
canal = 1
radio.set_group(canal)
```
