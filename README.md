# Sticks

From french TV series "Fort Boyard".
The game is simple. There are 20 sticks. Each player can draw one, two, or three sticks. The player with the last stick loses the game.

Use the keys to select the number of sticks you want to remove and use the Return key to remove the sticks.

### Play the game

The game is hosted on https://sticks-game-afd52.web.app/

### Compile to an executable

To compile you need npm

In a terminal run 

```shell
git clone https://github.com/raacee/sticks
cd sticks
npm install 
npm install -g @neutralinojs/neu
```

This will clone the project and install the dependencies to run the project and compile it

To compile the project run :

```shell
vite build #builds the frontend
neu build #builds the executable
```

If this didn't work try
```shell
./node_modules/.bin/vite build
neu build
```

The executables will be in ```dist/sticks```

### Dev server

If compilation doesn't work you can always start a dev server and play the game in your browser locally.  
  
Run one of these commands in that case :
```shell
vite
# or
./node_modules/.bin/vite 
```