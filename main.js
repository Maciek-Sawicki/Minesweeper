const dane = [1,42,5423,23,12,3];
const output = [];
let y = 0;

const ilorazIloczynu = () => {
    for (let index = 0; index < dane.length; index++) {
        if ((dane[index] <= -0.25) && (dane[index] >= 0,25)) {
            y = (Math.sqrt(4*(Math.pow(dane[index], 2)-1))/dane[index]);
            output.push(y);
        }
        else if (((dane[index] > -0.25) && (dane[index] < 0.25)) && (dane[index] != 0)) {
            y = 1/dane[index];
            output.push(y);
        }
        else if (dane[index] = 0 ) {
            y = 0;
            output.push(y);
        }
    }
}

console.log(dane);
ilorazIloczynu();
console.log(output);