const StateMachines = require("statemachines")

const ALPH = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

const wordToBoolVector = (x, w) => {
	return w.split("").map((c) => c === x)
}

const wholeWordProfile = (w) => {
	let curNum = 0;
	let res = []
	let seen = {}
	w.split("").forEach((c)=>{
		if(!seen[c]){
			curNum++;
			seen[c] = curNum
		}
		res.push(seen[c])
	})
	return res
}

const isSubsumedBy = (p1, p2) => {
	return p1.dist < p2.dist && Math.abs(p1.cons - p2.cons) <= p2.cons - p1.cons
}

const intToState = (i, w) => {
	return {
		cons :  i % (w.length + 1),
		dist :  Math.floor(i / (w.length + 1))
	}	
}

const stateToInt = (q, w) => {
	return (w.length + 1) * q.dist + q.cons
}

const computeK = (w, n, pos) => {
	return Math.min(n - pos.dist + 1, w.length - pos.cons)
}


const computeAllCharacteristicVectors = (w, n) => {
	vectors = {}
	subwords = computeRelevantSubwords()
}

const computeRelevantSubwords = (w, n) => {
	subwords = {}
	let k = Math.min(2 * n + 1, w.length - 1)
	// first compute relevant subwords with edit distance 0
	for (let i = 0; i < w.length - 1; i++){
		subwords[i] = w.substring(i + 1, k)
	}
}

function levenshtein(w, n){
	w = w.toLowerCase()
	let table = []
	let accepts = []
	// insert n * (w.len + 1) states
	for (let i = 0; i < n * (w.length + 1); i++){
		let state = intToState(i, w)
		let transitions = {}
	
		/*
		Shulz and Mihov note that while other states could be used as accepts,
		they're all subsumed by these states in the sense that the same surface form
		could have been arrived at by some other accepting edit history
		*/
		if (state.cons == w.length) accepts.push(i) 		
		if (state.cons < w.length && state.dist < n - 1){
			// star transitions 
			// I have uniliterally decided that for this use case we will lowercase everything because 
			// there is no way in hell that historical capitalization would have been standardized enough to be useful
			ALPH.forEach((c)=>{
				transitions[c] = [
					stateToInt({
						cons : state.cons + 1,
						dist : state.dist + 1
					}, w)
				]
			})
			// empty transitions
			transitions[""] = [
				stateToInt({
					cons : state.cons + 1,
					dist : state.dist + 1
				}, w)
			]
		}


		// plain letter transitions
		if (state.cons < w.length){
			transitions[w.charAt(state.cons)] = [
				stateToInt({
					dist : state.dist,
					cons : state.cons + 1
				}, w)
			]
		}

		// 
		if (state.dist < n - 1){
			ALPH.forEach((c)=>{
				if (transitions[c]){
					transitions[c].push([
						stateToInt({
							cons : state.cons,
							dist : state.dist + 1
						}, w)
					])
				}else{
					transitions[c] = [
						stateToInt({
							cons : state.cons,
							dist : state.dist + 1
						}, w)
					]
				}
			})
		}

		table.push(transitions)
	}


	return new StateMachines.Nondeterministic(table, accepts).subset()
}

function pathToInt(w, stateRegistry){
	return stateRegistry[w]
}

function trie(dict){

	let stateTicket = 1
	let stateRegistry = {}

	let table = []
	let accepts = []
	
	dict.forEach((w)=>{
		let transitions = {}
		for (let i = 0; i < w.length - 1; ++i){
			let prefix = w.substring(0, i + 1)
			// look at state i
			// look at state i + 1

			if (! table[i][i + 1]){
				stateRegistry[prefix] = stateTicket++;
			}
			// do we already have an edge (i, i + 1)?
				// if not, table[i][i + 1] = pathToInt(w.substring(0, i + 1))
				// if so, current state = table[i][i + 1]
			if (i = w.length - 1)
				accepts.push(stateRegistry[w])
		}
	})

}

console.log(wholeWordProfile("aachen"))

let machine = levenshtein("Benjamin Franklin", 4)
console.log(machine.test("Fenjamin Branklinz".toLowerCase()))
