import express from 'express';
import ExpressError from './expressError.js';

const app = express();
const port = 3000;


// this will be used in all routes, to clean up the query string
// and return an array of numbers
// it will throw an error if any of the values are not numbers
// or if the query string is missing
function getNums(query) {
    if (query.nums === undefined) {
        throw new ExpressError('Nums are required', 400);
    }

    const nums = query.nums.split(',').map(n => {
        const val = parseInt(n);
        if (isNaN(val)) {
            throw new ExpressError(`${n} is not a number`, 400);
        }
        return val;
    });

    return nums;
}

app.get('/mean', (req, res) => {
    const nums = getNums(req.query);

    // sum(array) / array.length
    const mean = nums.reduce((acc, cur) => acc + cur, 0) / nums.length;

    res.json({ response: {
        operation: 'mean',
        value: mean
    }});
});

app.get('/median', (req, res) => {
    const nums = getNums(req.query);

    // sort them in ascending order
    nums.sort((a, b) => a - b);

    // if the length is even, take the average of the middle two
    if (nums.length % 2 === 0) {
        const mid = nums.length / 2 - 1;
        const median = (nums[mid] + nums[mid + 1]) / 2;
        res.json({ response: {
            operation: 'median',
            value: median
        }});
        return;
    }

    // if the length is odd, take the middle value
    const mid = Math.floor(nums.length / 2);
    const median = nums[mid];

    res.json({ response: {
        operation: 'median',
        value: median
    }});
});

app.get('/mode', (req, res) => {
    const nums = getNums(req.query);

    // count the number of times each value appears
    const counts = {};
    for (let num of nums) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    const mode = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

    res.json({ response: {
        operation: 'mode',
        value: parseInt(mode)
    }});
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});