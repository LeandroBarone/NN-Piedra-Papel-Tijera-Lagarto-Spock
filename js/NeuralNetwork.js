// Esta clase permite crear una red neuronal simple con N inputs, outputs, y capas ocultas.
// Requiere Matrix.js.

class NeuralNetwork {
	constructor(config) {
		// config: [i, hi1, hi2, ... hiN, o]
		// Configura la cantidad de inputs (i), neuronas en cada capa oculta (hi), y ouputs (o)
		this.config = config;

		// La profundidad es la cantidad de instancias de procesamiento
		// Hay una instancia entre cada una de las capas y la siguiente
		this.depth = config.length - 1;

		// Función de activación
		// ReLU es la más rápida, pero no siempre funciona bien en esta implementación
		this.activation_function_name = 'relu';

		// Tasa de aprendizaje
		this.learning_rate = 0.01;

		// Las pesas es un array de matrices, uno por cada instancia de procesamiento
		// Cada matriz tiene una fila por cada elemento en la capa hacia la derecha y una columna por cada elemento en la capa hacia la izquierda
		this.weights = [];
		
		for (let i = 0; i < this.depth ; i++) {
			this.weights[i] = new Matrix(this.config[i+1], this.config[i]);
			this.weights[i].randomize();
		}
		
		// Los bias es un array de vectores, uno por cada instancia de procesamiento
		// Cada vector tiene un valor por cada elemento en la capa hacia la derecha
		this.bias = [];
		
		for (let i = 0; i < this.depth; i++) {
			this.bias[i] = new Matrix(this.config[i+1], 1);
			this.bias[i].randomize();
		}
	}

	setLearningRate(rate) {
		this.learning_rate = rate;
	}

	setActivationFunction(name) {
		this.activation_function_name = name;
	}

	static getActivationFunction(name) {
		// Devuelve un array con la función de activación elegida y su derivada

		// Softplus
		if (name === "softplus") return [
				x => Math.log(1 + Math.E**x),
				x => 1 / (1+Math.E**-x)
		];

		// ReLU
		// Como ReLU no tiene derivada, le asignamos un valor arbitrario a Y de 1 cuando X es 0 (por eso el "mayor o igual")
		if (name === "relu") return [
				x => Math.max(0, x),
				x => (x >= 0) ? 1 : 0
		];

		// Sigmoid
		if (name === "sigmoid") return [
				x => 1 / (1 + Math.exp(-x)),
				x => x * (1 - x)
		];
	}

	feedForward(inputs, return_everything = false) {
		// inputs = []
		// Esta función genera un array de matrices
		// El elemento 0 del array son los inputs
		// Los elementos subsiguientes son los valores transformados por cada instancia de procesamiento

		// Agregamos los inputs al principio de los outputs
		let outputs = [];
		outputs[0] = Matrix.fromArray(inputs);

		// Ejecutamos todas las instancias de procesamiento
		for (let i = 0; i < this.depth; i++) {
			// Multiplicamos los valores del output más reciente por las pesas
			let next_output = Matrix.dotProduct(this.weights[i], outputs[i]);
			// Sumamos los bias
			next_output = next_output.addMatrix(this.bias[i]);
			// Función de activación
			let func = NeuralNetwork.getActivationFunction(this.activation_function_name)[0];
			next_output = next_output.map(func);
			// Guardamos los resultados como parte de los outputs
			outputs.push(next_output);
		}

		// Devolvemos todos los outputs, o solamente un array con los valores finales
		if (return_everything) {
			return outputs;
		}
		else {
			return outputs.pop().toArray();
		}
	}

	train(inputs, answers) {
		// inputs = [i1, i2, ... iN]
		// answers = [a1, a2, ... aN]
		// Esta función entrena la red neuronal con respuestas conocidas

		// Convertimos las respuestas conocidas en una matriz
		let answer_matrix = Matrix.fromArray(answers);

		// Procesamos los inputs en la red neuronal
		let outputs  = this.feedForward(inputs, true);

		// Calculamos las tasas de error para cada instancia, empezando por los outputs
		let errors = [];
		errors[this.depth] = answer_matrix.substractMatrix(outputs[outputs.length - 1]);

		// Propagamos hacia atrás las tasas de error para cada instancia
		for (let i = this.depth-1; i >= 0; i--) {
			// Ponderamos los errores
			// let weighted_errors = errors[i+1].multiplyMatrix(this.weights[i].reduce().powerScalar(-1));
			// Calculamos la tasa de error
			errors[i] = Matrix.dotProduct(Matrix.transpose(this.weights[i]), errors[i+1]);
		}

		// Calculamos los gradientes para cada instancia
		let gradients = [];

		for (let i = 0; i < this.depth; i++) {
			// "Desacvtivamos" los valores con la derivada de la función de activación
			let func = NeuralNetwork.getActivationFunction(this.activation_function_name)[1];
			gradients[i] = outputs[i+1].map(func);
			// Multiplicamos esos valores por las tasas de error
			gradients[i] = gradients[i].multiplyMatrix(errors[i+1]);
			// Y multiplicamos eso por la tasa de aprendizaje
			gradients[i] = gradients[i].multiplyScalar(this.learning_rate);
		}

		// Modificamos las pesas a partir de los gradientes
		for (let i = 0; i < this.depth; i++) {
			// El delta es el gradiente multiplicado por el output de esa instancia de procesamiento
			let delta = Matrix.dotProduct(gradients[i], Matrix.transpose(outputs[i]));
			this.weights[i] = this.weights[i].addMatrix(delta);
		}

		// Modificamos los bias a partir de los gradientes
		for (let i = 0; i < this.depth; i++) {
			let delta = gradients[i];
			this.bias[i] = this.bias[i].addMatrix(delta);
		}
		
		return true;
	}

	visualize() {
		let html = '';

		// Cabeceras
		html += '<table cellpadding="0" cellspacing="0"><thead><tr>';
		html += `<th>Inputs</th>`;

		for (let i = 0; i < this.depth; i++) {
			html += `<th>Weights</th>`;
			html += `<th>Bias</th>`;
			if (i+1 < this.depth) {
				html += `<th>Hidden layer ${i+1}</th>`;
			}
			else {
				html += `<th>Outputs</th>`;
			}
		}

		html += '</tr></thead>';

		// Cuerpo
		html += '<tbody><tr>';

		// Inputs
		html += `<td class="center">${this.config[0]} nodes</td>`;

		// Pesas, bias y capas
		for (let i = 0; i < this.depth; i++) {
			let htmlw = '';

			for (let j = 0; j < this.weights[i].matrix.length; j++) {
				for (let k = 0; k < this.weights[i].matrix[j].length; k++) {
					let v = this.weights[i].matrix[j][k].toFixed(4);
					htmlw += `W<sup>${i+1}</sup><sub>${j+1} ${k+1}</sub>: ${v}<br />`;
				}
			}

			let htmlb = '';

			for (let j = 0; j < this.bias[i].matrix.length; j++) {
				let v = this.bias[i].matrix[j][0].toFixed(4);
				htmlb += `B<sup>${i+1}</sup><sub>${j+1}</sub>: ${v}<br />`;
			}

			html += `<td>${htmlw}</td>`;
			html += `<td>${htmlb}</td>`;
			html += `<td class="center">${this.config[i+1]} nodes</td>`;
		}

		// Pie
		html += '</tr></tbody></table>';

		return html;
	}

	static getHighestIndex(arr) {
		// arr = [v1, v2, ... vN];
		// Devuelve el índice del valor más alto del array

		let highest = -Infinity;
		let highest_index = 0;

		for (let i = 0; i < arr.length; i++) {
			if (arr[i] > highest) {
				highest = arr[i];
				highest_index = i;
			}
		}

		return highest_index;
	}
}