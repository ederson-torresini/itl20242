# Aula 2

Aprender sobre variáveis e estruturas de decisão e de repetição.

## Experimento 2.1: jogo de nave

Jogo para dois jogadores: cada um controla sua nave, com movimentação lateral (botões A e B), e pode atirar laser no oponente (A + B). Vence quem acertar 3 tiros primeiro. Baseado **TOTALMENTE** no vídeo [Episode 7 - Wargames](https://www.youtube.com/watch?v=l7LTg15KPgE) do canal [Micromonsters](https://www.youtube.com/@MicroMonsters).

Código em Python:

```python
def on_received_number(receivedNumber):
    global tiro
    tiro = game.create_sprite(receivedNumber, 0)
    for índice in range(4):
        basic.pause(100)
        tiro.change(LedSpriteProperty.Y, 1)
    if tiro.is_touching(nave):
        radio.send_string("acertou")
        game.remove_life(1)
    tiro.delete()
radio.on_received_number(on_received_number)

def on_button_pressed_a():
    nave.change(LedSpriteProperty.X, -1)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_ab():
    global tiro
    tiro = game.create_sprite(nave.get(LedSpriteProperty.X), 4)
    for índice2 in range(4):
        basic.pause(100)
        tiro.change(LedSpriteProperty.Y, -1)
    radio.send_number(tiro.get(LedSpriteProperty.X))
    tiro.delete()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_received_string(receivedString):
    if receivedString == "acertou":
        game.add_score(1)
    elif receivedString == "ganhou":
        game.game_over()
radio.on_received_string(on_received_string)

def on_button_pressed_b():
    nave.change(LedSpriteProperty.X, 1)
input.on_button_pressed(Button.B, on_button_pressed_b)

tiro: game.LedSprite = None
nave: game.LedSprite = None
radio.set_group(1)
nave = game.create_sprite(2, 4)
game.set_life(3)

def on_forever():
    if game.is_game_over():
        radio.send_string("ganhou")
    basic.pause(100)
basic.forever(on_forever)
```
