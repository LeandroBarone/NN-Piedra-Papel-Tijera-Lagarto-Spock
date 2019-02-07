class Matrix {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.matrix = [];

		for (let i = 0; i < rows; i++) {
			this.matrix[i] = [];

			for (let j = 0; j < cols; j++) {
				this.matrix[i][j] = 0;
			}
		}
	}

	static fromArray(arr) {
		let new_matrix = new Matrix(arr.length, 1);

		for (let i = 0; i < arr.length; i++) {
			new_matrix.matrix[i][0] = arr[i];
		}

		return new_matrix;
	}

	toArray() {
		if (this.cols > 1) {
			throw("Unimplemented");
		}

		let arr = [];

		for (let i = 0; i < this.rows; i++) {
			arr[i] = this.matrix[i][0];
		}

		return arr;
	}

	clone() {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			result[i] = this.matrix[i].slice(0);
		}

		return result;
	}

	randomize() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.matrix[i][j] = Math.random() * 2 -1;
			}
		}
	}

	print() {
		console.table(this.matrix);
	}

	addScalar(scalar) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] + scalar;
			}
		}

		return result;
	}

	substractScalar(scalar) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] - scalar;
			}
		}

		return result;
	}

	multiplyScalar(scalar) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] * scalar;
			}
		}

		return result;
	}

	divideScalar(scalar) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] / scalar;
			}
		}

		return result;
	}

	powerScalar(scalar) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] ** scalar;
			}
		}

		return result;
	}

	addMatrix(matrix) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] + matrix.matrix[i][j];
			}
		}

		return result;
	}

	substractMatrix(matrix) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] - matrix.matrix[i][j];
			}
		}

		return result;
	}

	multiplyMatrix(matrix) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] * matrix.matrix[i][j];
			}
		}

		return result;
	}

	hadamard(matrix) {
		this.multiplyMatrix(matrix);
	}

	divideMatrix(matrix) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] * matrix.matrix[i][j];
			}
		}

		return result;
	}

	powerMatrix(matrix) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = this.matrix[i][j] ** matrix.matrix[i][j];
			}
		}

		return result;
	}

	reduce() {
		let result = new Matrix(this.rows, 1);

		for (let i = 0; i < this.rows; i++) {
			result.matrix[i][0] = 0;
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][0] += this.matrix[i][j];
			}
		}

		return result;
	}

	map(func) {
		let result = new Matrix(this.rows, this.cols);

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.matrix[i][j] = func(this.matrix[i][j]);
			}
		}

		return result;
	}

	static dotProduct(matrix1, matrix2) {
		if (matrix1.cols !== matrix2.rows) {
			throw("Error: multiplying non compatible matrices.");
			return null;
		}

		let result = new Matrix(matrix1.rows, matrix2.cols);
		
		for (let i = 0; i < matrix1.rows; i++) {
			for (let j = 0; j < matrix2.cols; j++) {
				let sum = 0;
				for (let k = 0; k < matrix2.rows; k++) {
					sum += matrix1.matrix[i][k] * matrix2.matrix[k][j];
				}
				result.matrix[i][j] = sum;
			}
		}

		return result;
	}

	static transpose(matrix) {
		let result = new Matrix(matrix.cols, matrix.rows);
		
		for (let i = 0; i < matrix.rows; i++) {
			for (let j = 0; j < matrix.cols; j++) {
				result.matrix[j][i] = matrix.matrix[i][j];
			}
		}

		return result;
	}
}