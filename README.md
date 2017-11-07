# SWRPG Dice Tweeker
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Reddit: elaum](https://img.shields.io/badge/Reddit-Elaum-blue.svg)](https://www.reddit.com/u/elaum)

This tool for Star Wars RPG (FFG) allows you to tweek your dices to find the perfect difficulty setting for your need.

## Webapp
Launch the [webapp](https://stgfop.github.io/SWRPGDiceTweeker/code/index.html)

## Offline Installation
1. Clone this repository : [download latest master.zip](https://github.com/stgfop/SWRPGDiceTweeker/archive/master.zip)
2. Unzip the master.zip archive
3. Navigate to the SWRPGDiceTweeker-master/code folder
4. Open the file index.html with your favorite browser

## User Guide
### Usage

1.  Select the Caracteristic level of your player (eg. Brawn)
2.  Select the Skill level of your player (eg. Athletics)
3.  The result is displayed on the bottom table
4.  Tweek the amount of Boost, Setback and Challenge dices until satisfied

### What is computed ?

The table has 4 columns showing the amount of Success, Advantage, Triumph and Despair you can expect per Roll on average.
A negative Success/Advantage indicates a number of Failure/Threat instead.
For example a value of :

*   1 indicate you can expect 1 symbol every roll on average
*   2 indicate you can expect 2 symbol every roll on average
*   3 indicate you can expect 3 symbol every roll on average
*   ...
*   0.5 indicate you can expect 1 symbol every 2 rolls on average
*   0.25 indicate you can expect 1 symbol every 4 rolls on average

The value computed are the Expected Values, see [Wikipedia article](https://en.wikipedia.org/wiki/Expected_value)

## Authors

* **Elaum** - *Initial work* - [![Reddit: elaum](https://img.shields.io/badge/Reddit-Elaum-blue.svg)](https://www.reddit.com/u/elaum)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

