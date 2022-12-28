import inquirer from "inquirer"

// Configure the questions to ask the user in the terminal
const questions = [
	{
		type: 'input',
		name: 'totalStitches',
		message: "What is the total number of stitches?",
	},
	{
		type: 'input',
		name: 'stitchesToPickUp',
		message: "How many stitches do you need to pick up?",
	}
]

inquirer.prompt(questions).then(answers => {
	// Define utility functions
	function findMultiples(num, start=3) {
		let multiples = []
		for (let i = start; i <= num - 1; i++) {
			if (num % i === 0) {
				multiples.push(i)
			}
		}
		return multiples
	}

	function isPrime(num) {
		for (let i = 2; i < num; i++) {
			if (num % i === 0) {
				return false
			}
		}
		return num > 1
	}

	// Make array of prime multiples
	const primeMultiples = {
		totalStitches: findMultiples(answers.totalStitches),
		stitchesToPickUp: findMultiples(answers.stitchesToPickUp)
	}

	// Find the common multiples
	let commonMultiples = primeMultiples.totalStitches.filter(num => primeMultiples.stitchesToPickUp.includes(num))
	let counter = 0

	while (commonMultiples.length === 0) {
		counter++

		// Add counter to the totalStitches and try again
		let higherTotalStitches = answers.totalStitches + counter
		primeMultiples.totalStitches = findMultiples(higherTotalStitches)
		commonMultiples = primeMultiples.totalStitches.filter(num => primeMultiples.stitchesToPickUp.includes(num))

		// Subtract counter from the totalStitches and try again
		let lowerTotalStitches = answers.totalStitches - counter
		primeMultiples.totalStitches = findMultiples(lowerTotalStitches)
		commonMultiples = primeMultiples.totalStitches.filter(num => primeMultiples.stitchesToPickUp.includes(num))
	}

	// If counter is greater than 0, generate remainder statement
	let remainderStatement = ''
	if (counter > 0) {
		remainderStatement = ` with a remainder of ${counter} additional un-picked-up stitches across the total number of stitches (${answers.totalStitches})`
	}


	// Divide each stitch count by the common multiple
	const totalStitches = Math.floor(answers.totalStitches / commonMultiples[0])
	const stitchesToPickUp = answers.stitchesToPickUp / commonMultiples[0]

	if (isPrime(totalStitches) || isPrime(stitchesToPickUp)) {
		console.log(`Pick up ${stitchesToPickUp} out of every ${totalStitches} stitches${remainderStatement}.`)
		return
	} else {
		// Reduce the totalStitches and stitchesToPickUp to their prime factors
		const totalStitchesPrimeFactors = findMultiples(totalStitches, 2)
		const stitchesToPickUpPrimeFactors = findMultiples(stitchesToPickUp, 2)
		
		// Find the common prime factors
		const commonPrimeFactors = totalStitchesPrimeFactors.filter(num => stitchesToPickUpPrimeFactors.includes(num))
		console.log(`Pick up ${stitchesToPickUp / commonPrimeFactors[0]} out of every ${totalStitches / commonPrimeFactors[0]} stitches${remainderStatement}.`)
	}
})