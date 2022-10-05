let canvas = document.getElementById("cnv");
let ctx = canvas.getContext("2d");
let width, height;
let dateStart;
let running = false;

class Stack {
	constructor (s_size, min, max) {
		this.a = [];
		this.b = [];
		this.len = s_size;
		this.min = min;
		this.max = max;
		this.instr = [];
		this.instr_indx = 0;
	}
	exec (s) {
		if (s == "")
		{
			const dateEnd = new Date();
			console.log(`${dateEnd} [${dateEnd - dateStart} ms ellapsed]`);
			console.log("Done! :D");
			document.getElementById("resault").innerHTML +=
				` Time: ${dateEnd - dateStart}ms.`;
			this.instr_indx++;
			return;
		}
		switch (s[0]) {
			case "s": // swap first with second of the current stack.
				if (this[s[1]] && this[s[1]][0] && this[s[1]][1]) {
					let tmp = this[s[1]][0];
					this[s[1]][0] = this[s[1]][1];
					this[s[1]][1] = tmp;
					break;
				}
				if (s[1] == "s") {
					let tmp = this.a[0];
					this.a[0] = this.a[1];
					this.a[1] = tmp;
					tmp = this.b[0];
					this.b[0] = this.b[1];
					this.b[1] = tmp;
					break;
				}
				console.log(`"${s}" is not an instruction!`);
			break;
			case "p": //push stack a to b
				let other_stack = (s[1] == "a"? "b" : "a");
				if (this[other_stack][0]) {
					this[s[1]].unshift(this[other_stack][0]);
					this[other_stack].shift();
					break;
				}
				console.log(`"${s}" is not an instruction!`);
			break;
			case "r":
				if (s[1] != "r") {
					this[s[1]].push(this[s[1]].shift());
					break;
				} else if (s[1] == "r") {
					if (this[s[2]])
						this[s[2]].unshift(this[s[2]].pop());
					else
					{
						this.a.push(this.a.shift());
						this.b.push(this.b.shift());
					}
					break;
				}
				console.log(`"${s}" is not an instruction!`);
			break;
			default:
				console.log(`"${s}" is not an instruction!`);
			break;
		}
		this.draw(ctx);
		this.instr_indx++;
	}
	draw (ctx2d) {
		const h = height / this.len;
		const half_width = width / 2;
		const gutter_container = document.getElementById("gutter-container");
		let first_child = gutter_container.childNodes[0];
		ctx.clearRect(0, 0, width, height);
		for (let i = 0; i < this.a.length; i++) {
			let data_normal = this.a[i] / this.max;
			ctx2d.fillStyle = `rgba(${data_normal * 255},25,${(1 - data_normal) * 255},1)`;
			ctx2d.beginPath();
			ctx2d.fillRect(0, i * h, data_normal * half_width, h + 1);
			// ctx2d.stroke();
		}
		for (let i = 0; i < this.b.length; i++) {
			let data_normal = this.b[i] / this.max;
			ctx2d.fillStyle = `rgba(${data_normal * 255},25,${(1 - data_normal) * 255},1)`;
			ctx2d.beginPath();
			ctx2d.fillRect(half_width, i * h, data_normal * half_width, h + 1);
			// ctx2d.stroke();
		}
		ctx2d.fillStyle = "white";
		ctx2d.beginPath();
		ctx2d.fillRect(half_width, 0, 2, height);
		ctx2d.stroke();
		
		if (first_child)
			first_child.remove();
		if (gutter_container.childNodes.length == 0) {
			for (let indx = 0; indx < Math.min(50, this.instr.length - this.instr_indx); indx++ ) {
				gutter_container.innerHTML +=
				`<span class="gutter-wraper">
					<span class="gutter">${this.instr_indx + indx}</span>
					<span>${this.instr[this.instr_indx + indx]}</span>
				</span>`;
			}
		}
		first_child = gutter_container.childNodes[0];
		if (first_child)
			first_child.style.background="#ffff0042";
	}
}

function resizeCanvas () {
	canvas.width = canvas.height = 0;
	const bound = canvas.parentElement.getBoundingClientRect();
	width = canvas.width = bound.width > 400? bound.width : 400;
	height = canvas.height = bound.height > 400? bound.height: 400;
}

window.addEventListener("load", async function () {

	let instr = await fetch("./../instr.txt");
	let rand = await fetch("./../rand.txt");
	if (!instr.ok || !rand.ok)
	{
		this.alert("Failed to load instructions.\nTry \"make genfile\".");
		return;
	}
	instr = (await instr.text()).split("\n");
	rand = (await rand.text())
		.split(" ")
		.map(a => parseInt(a, 10));
	
	let stack = new Stack(rand.length, Math.min(...rand), Math.max(...rand));
	window.addEventListener("resize", function () {
		resizeCanvas();
		stack.draw(ctx);
	});
	resizeCanvas();
	stack.a = rand;
	stack.instr = instr;

	document.getElementById("reset_inp").addEventListener("click", async function() {
		instr = (await (await fetch("./../instr.txt")).text()).split("\n");
		rand = (await (await fetch("./../rand.txt")).text())
			.split(" ")
			.map(a => parseInt(a, 10));
		stack = new Stack(rand.length, Math.min(...rand), Math.max(...rand));
		stack.a = rand;
		stack.instr = instr;
		stack.instr_indx = 0;
		document.getElementById("resault").innerHTML = `Instructions: ${instr.length}`;
		document.getElementById("gutter-container").innerHTML = "";
		stack.draw(ctx);
		running = false;
		dateStart = new Date();
	})
	document.getElementById("run_inp").addEventListener("click", function() {
		running = true;
	})
	document.getElementById("stop_inp").addEventListener("click", function() {
		running = false;
	})
	document.getElementById("next_inp").addEventListener("click", function() {
		stack.exec(instr[stack.instr_indx]);
	})

	stack.draw(ctx);
	dateStart = new Date();
	console.log(dateStart);
	document.getElementById("resault").innerHTML = `Instructions: ${instr.length}`;
	function loop () {
		if (stack.instr_indx != instr.length)
		{
			if (running)
				stack.exec(instr[stack.instr_indx]);
		}
		setTimeout(() => {
			window.requestAnimationFrame(loop);
		}, document.getElementById("speed_inp").value);
	}

	window.requestAnimationFrame(loop);

	this.window.stack = stack;

});
