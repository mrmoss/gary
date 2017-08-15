var kb_left=37;
var kb_up=38;
var kb_right=39;
var kb_down=40;
var kb_space=32;

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

function canvas_t(canvas_obj,setup_func,loop_func,draw_func)
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
};

canvas_t.prototype.setup=function()
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

	this.user_setup(this);
	this.loop();

	var _this=this;
	window.addEventListener('keydown',function(evt){_this.keydown(evt);},true);
	window.addEventListener('keyup',function(evt){_this.keyup(evt);},true);

	return true;
};

canvas_t.prototype.keydown=function(evt)
{
	if(!this.keys_down[evt.keyCode])
		this.keys_pressed[evt.keyCode]=true;

	this.keys_down[evt.keyCode]=true;
};

canvas_t.prototype.keyup=function(evt)
{
	this.keys_released[evt.keyCode]=true;
	this.keys_down[evt.keyCode]=false;
};

canvas_t.prototype.loop=function()
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

	var _this=this;
	window.requestAnimationFrame(function(){_this.loop();});
}

canvas_t.prototype.draw=function()
{
	if(this.canvas&&this.ctx&&this.user_draw)
	{
		this.ctx.fillStyle=this.clear_color;
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.user_draw();
		this.ctx.restore();
	}
}
