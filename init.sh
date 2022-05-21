rm -rf ./build
truffle migrate --reset
# yarn
rm -rf ./ui/src/contracts
cp -R ./build/contracts ./ui/src
cd ./ui
yarn deploy
# serve -s ./build
