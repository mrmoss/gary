var kb_shift=16;
var kb_control=17;
var kb_space=32;
var kb_left=37;
var kb_up=38;
var kb_right=39;
var kb_down=40;
var kb_a=65;
var kb_b=66;
var kb_c=67;
var kb_d=68;
var kb_e=69;
var kb_f=70;
var kb_g=71;
var kb_h=72;
var kb_i=73;
var kb_j=74;
var kb_k=75;
var kb_l=76;
var kb_m=77;
var kb_n=78;
var kb_o=79;
var kb_p=80;
var kb_q=81;
var kb_r=82;
var kb_s=83;
var kb_t=84;
var kb_u=85;
var kb_v=86;
var kb_w=87;
var kb_x=88;
var kb_y=89;
var kb_z=90;
var kb_alt=18;

var mb_left=0;
var mb_middle=1;
var mb_right=2;

function point_direction(x1,y1,x2,y2)
{
	return Math.atan2(x1-x2,y2-y1)+Math.PI/2.0
}

function point_distance(x1,y1,x2,y2)
{
	var dx=Math.abs(x2-x1);
	dx=dx*dx;
	var dy=Math.abs(y2-y1);
	dy=dy*dy;
	return Math.sqrt(dx+dy);
}

function normalize_radians(radians)
{
	while(radians<0)
		radians+=Math.PI*2;
	while(radians>=Math.PI*2)
		radians-=Math.PI*2;
	return radians;
}

function check_collision_pos(obj1,x,y,obj2)
{
	return (x+obj1.width>obj2.x&&
		x<=obj2.x+obj2.width&&
		y>obj2.y-obj2.height&&
		y-obj1.height<=obj2.y);
}

function check_collision_beneath_pos(obj1,x,y,obj2)
{
	return (x+obj1.width>=obj2.x&&
		x<=obj2.x+obj2.width&&
		y>obj2.y-obj2.height&&
		y-obj1.height<=obj2.y&&
		y-(obj2.y-obj2.height)<=1);
}

function simulation_t(canvas_obj,setup_func,loop_func,draw_func)
{
	this.canvas=canvas_obj;
	this.clear_color='#ffffff';
	this.old_time=new Date();
	this.user_setup=setup_func;
	this.user_loop=loop_func;
	this.user_draw=draw_func;
	this.ctx=null;
	this.keys_down=[];
	this.keys_pressed=[];
	this.keys_released=[];
	this.mouse_down=[];
	this.mouse_pressed=[];
	this.mouse_released=[];
	this.mouse_x=0;
	this.mouse_y=0;
};

simulation_t.prototype.setup=function()
{
	if(!this.canvas)
		return false;

	this.ctx=this.canvas.getContext('2d');

	if(!this.ctx)
		return false;

	for(var ii=0;ii<255;++ii)
	{
		this.keys_down[ii]=false;
		this.keys_pressed[ii]=false;
		this.keys_released[ii]=false;
	}

	for(var ii=0;ii<4;++ii)
	{
		this.mouse_down[ii]=false;
		this.mouse_pressed[ii]=false;
		this.mouse_released[ii]=false;
	}

	this.user_setup(this);
	this.loop();

	var _this=this;
	window.addEventListener('keydown',function(evt){_this.keydown(evt);},true);
	window.addEventListener('keyup',function(evt){_this.keyup(evt);},true);
	window.addEventListener('mousedown',function(evt){_this.mousedown(evt);},true);
	window.addEventListener('mouseup',function(evt){_this.mouseup(evt);},true);
	this.canvas.addEventListener('mousemove',function(evt)
	{
		var rect=_this.canvas.getBoundingClientRect();
		_this.mouse_x=(evt.clientX-rect.left)/rect.width*_this.canvas.width;
		_this.mouse_y=(evt.clientY-rect.top)/rect.height*_this.canvas.height;
		if(_this.mouse_x<0)
			_this.mouse_x=0;
		if(_this.mouse_y<0)
			_this.mouse_y=0;
		if(_this.mouse_x>_this.canvas.width)
			_this.mouse_x=_this.canvas.width;
		if(_this.mouse_y>_this.canvas.height)
			_this.mouse_y=_this.canvas.height;
	});

	return true;
};

simulation_t.prototype.keydown=function(evt)
{
	evt.preventDefault();
	if(!this.keys_down[evt.keyCode])
		this.keys_pressed[evt.keyCode]=true;

	this.keys_down[evt.keyCode]=true;
};

simulation_t.prototype.keyup=function(evt)
{
	evt.preventDefault();
	this.keys_released[evt.keyCode]=true;
	this.keys_down[evt.keyCode]=false;
};

simulation_t.prototype.mousedown=function(evt)
{
	evt.preventDefault();
	if(!this.mouse_down[evt.button])
		this.mouse_pressed[evt.button]=true;

	this.mouse_down[evt.button]=true;
};

simulation_t.prototype.mouseup=function(evt)
{
	evt.preventDefault();
	this.mouse_released[evt.button]=true;
	this.mouse_down[evt.button]=false;
};

simulation_t.prototype.loop=function()
{
	if(this.user_loop&&this.old_time&&this.loop&&this.draw)
	{
		var new_time=new Date();
		this.user_loop(Math.min((new_time-this.old_time)/1000.0,0.1));
		this.old_time=new_time;
		this.draw();
	}

	for(var ii=0;ii<255;++ii)
	{
		this.keys_pressed[ii]=false;
		this.keys_released[ii]=false;
	}

	for(var ii=0;ii<4;++ii)
	{
		this.mouse_pressed[ii]=false;
		this.mouse_released[ii]=false;
	}

	var _this=this;
	window.requestAnimationFrame(function(){_this.loop();});
}

simulation_t.prototype.draw=function()
{
	if(this.canvas&&this.ctx&&this.user_draw)
	{
		this.ctx.beginPath();
		this.ctx.fillStyle=this.clear_color;
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.user_draw();
		this.ctx.restore();
	}
}
