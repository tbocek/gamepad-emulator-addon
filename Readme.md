# Emulate Gamepad on Xbox Cloud to Play with Keyboard / Mouse

This is a Firefox addon to be able to play e.g., Fortnite with keyboard and mouse on Xbox Cloud. Xbox Cloud supports keyboard and mouse for selected games, Fortnite is not one of them. Thus, this addon fixes this.

This addon is based on the Chrome extension [xboxcloud_keyboard_mouse ](https://github.com/LastZactionHero/xboxcloud_keyboard_mouse), which is based on [TouchStadia](https://github.com/ihatecsv/TouchStadia), which is released under GPLv3, hence this project is also using this license.

The changes that were made:
* Make it work with Firefox
* Simplify code and only use Xbox Cloud URL

## The mapping

- **ID**: `Keyboard/Mouse Emulated Gamepad`
- **Index**: `0`
- **Connected**: `true`
- **Timestamp**: `0`
- **Mapping**: `standard`
- **Axes**: `[0, 0, 0, 0]`

### Left Stick
- **Up**: `w`
- **Left**: `a`
- **Down**: `s`
- **Right**: `d`

### Right Stick
- **Mouse movements**

### Buttons

1. **A (Button 0)**
    - **Action**: Activate
    - **Keys**: `e`
2. **B (Button 1)**
    - **Action**: Sneak, Back
    - **Keys**: `c`, `Escape`, `b`
3. **X (Button 2)**
    - **Action**: Reload
    - **Keys**: `r`, `x`
4. **Y (Button 3)**
    - **Action**: Jump
    - **Keys**: `Space`, `y`
5. **L1 (Button 4)**
    - **Action**: Flashlight, Scanner
    - **Keys**: `1`
6. **R1 (Button 5)**
    - **Action**: Grenade
    - **Keys**: `2`
7. **L2 (Button 6)**
    - **Action**: Aim
    - **Mouse Button**: Right (2)
8. **R2 (Button 7)**
    - **Action**: Fire
    - **Mouse Button**: Left (0)
9. **Select (Button 8)**
    - **Keys**: `\`
10. **Start (Button 9)**
    - **Keys**: `Enter`
11. **L3 (Button 10)**
    - **Action**: Run
    - **Keys**: `Shift`
12. **R3 (Button 11)**
    - **Action**: Bash
    - **Mouse Button**: Middle (1)
13. **D-pad Up (Button 12)**
    - **Keys**: `i`
14. **D-pad Down (Button 13)**
    - **Keys**: `k`
15. **D-pad Left (Button 14)**
    - **Keys**: `j`
16. **D-pad Right (Button 15)**
    - **Keys**: `l`
17. **Home (Button 16)**
    - **Keys**: `h`