function gary_t(x,y)
{
	this.base=new gary_base_t(x,y);
	this.base.spr=new sprite_t('gary.png',2,true);
	this.base.speed=10;

	this.base.tenticles.push(new gary_tenticle_t(this.base, 18,-10,0,1,15,8));
	this.base.tenticles.push(new gary_tenticle_t(this.base, 15,-20,-Math.PI/4,-1,15,8));
	this.base.tenticles.push(new gary_tenticle_t(this.base,-18,-10,Math.PI,1,15,8));
	this.base.tenticles.push(new gary_tenticle_t(this.base,-15,-22,-3*Math.PI/4,-1,15,8));

	this.base.eyes.push(new eye_t(this.base));
	this.base.eyes_xoffs.push(-2);
	this.base.eyes_yoffs.push(-37);
	this.base.eyes[0].yoff=this.base.eyes_yoffs[0];
	this.base.eyes[0].max_dist=2;

	this.base.eyes.push(new eye_t(this.base));
	this.base.eyes_xoffs.push(1);
	this.base.eyes_yoffs.push(-18);
	this.base.eyes[1].yoff=this.base.eyes_yoffs[1];
	this.base.eyes[1].max_dist=2.5;
}

gary_t.prototype.loop=function(simulation,dt,level)
{
	this.base.width=35;
	this.base.loop(simulation,dt,level);
}

gary_t.prototype.draw=function(simulation)
{
	this.base.draw(simulation);
}

function gary_mini_t(x,y)
{
	this.base=new gary_base_t(x,y);
	this.base.spr=new sprite_t('gary_mini.png',2,true);
	this.base.speed=15;
	this.base.noflip=false;
	this.base.max_frenzy=2;

	this.base.tenticles.push(new gary_tenticle_t(this.base, 10,-10,-Math.PI/4,1,12,6));
	this.base.tenticles.push(new gary_tenticle_t(this.base,-10,-10,-3*Math.PI/4,-1,12,6));

	this.base.eyes.push(new eye_t(this.base));
	this.base.eyes_xoffs.push(-1);
	this.base.eyes_yoffs.push(-20);
	this.base.eyes[0].yoff=this.base.eyes_yoffs[0];
	this.base.eyes[0].max_dist=2.5;
}

gary_mini_t.prototype.loop=function(simulation,dt,level)
{
	this.base.width=20;

	this.base.spr.x_scale=Math.abs(this.base.spr.x_scale)*this.base.dir;
	this.base.loop(simulation,dt,level);
}

gary_mini_t.prototype.draw=function(simulation)
{
	this.base.draw(simulation);
}

function gary_base_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr=null
	this.dir=1;
	this.speed=0;
	this.frenzy=0;
	this.max_frenzy=1;
	this.noflip=true;

	this.physics=new physics_t(this);

	this.eyes=[];
	this.eyes_xoffs=[];
	this.eyes_yoffs=[];

	this.tenticles=[];

	this.pendulum=new pendulum_t(1100,200);
};

gary_base_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=20;
	this.height=this.spr.height;

	this.physics.loop(simulation,dt,level);

	//Flail tenticles faster if player is close
	this.frenzy=Math.max(0.3,Math.min(this.max_frenzy,80/Math.abs(point_distance(this.x,this.y,level.player.x,level.player.y))));

	//Getto animation hack
	this.pendulum.loop(simulation,dt,level,this.frenzy);
	var start_dir=this.dir;
	if(this.noflip)
		start_dir=1;
	this.spr.x_scale=start_dir-this.pendulum.inc/this.pendulum.max*dt/5;
	this.spr.y_scale=1.0+this.pendulum.inc/this.pendulum.max*dt/5;

	//Dumb AI
	var buffer=5;
	if(level.player.x<this.x-buffer)
		this.dir=-1;
	else if(level.player.x>this.x+buffer)
		this.dir=1;
	this.physics.set_new_x(this.speed*this.dir*dt);

	for(var ii=0;ii<this.eyes.length;++ii)
	{
		this.eyes[ii].xoff=this.eyes_xoffs[ii]*this.spr.x_scale;
		this.eyes[ii].yoff=this.eyes_yoffs[ii]*this.spr.y_scale;
		this.eyes[ii].loop(simulation,dt,level);
	}

	for(var ii=0;ii<this.tenticles.length;++ii)
		this.tenticles[ii].loop(simulation,dt,level);
};

gary_base_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	for(var ii=0;ii<this.tenticles.length;++ii)
		this.tenticles[ii].draw(simulation);

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.frame=1;
	this.spr.draw(simulation);
	simulation.ctx.restore();

	for(var ii=0;ii<this.eyes.length;++ii)
		this.eyes[ii].draw(simulation);

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.frame=0;
	this.spr.draw(simulation);
	simulation.ctx.restore();
};

//http://www.zarkonnen.com/airships/tentacle_logic
function gary_tenticle_t(parent,xoff,yoff,dir,dir_multiplier,segments,start_thickness)
{
	this.parent=parent;

	this.xoff=xoff;
	this.yoff=yoff;

	if(!this.xoff)
		this.xoff=0;
	if(!this.yoff)
		this.yoff=0;
	if(!dir)
		dir=0;
	if(!dir_multiplier)
		dir_multiplier=1;

	this.x=this.parent.x+this.xoff;
	this.y=this.parent.y+this.yoff;

	this.segments=[];
	this.target_x=0;
	this.target_y=0;
	this.pendulum=new pendulum_t(1000*dir_multiplier,200);

	var thickness=start_thickness;
	var total_length=0;
	var parent=null;

	for(var ii=0;ii<segments;++ii)
	{
		parent=new gary_segment_t(this,parent);

		parent.thickness=thickness;
		parent.dir=dir;
		parent.target_dir=Math.PI/2.0/segments*ii*dir_multiplier;

		var distance=start_thickness-ii/2.0;
		parent.left_muscle=new gary_muscle_t(distance/2.0,distance);
		parent.right_muscle=new gary_muscle_t(distance/2.0,distance);

		parent.xoff=total_length;
		parent.yoff=0;

		this.segments.push(parent);

		thickness=thickness*0.92;
		total_length+=distance;
	}
}

gary_tenticle_t.prototype.loop=function(simulation,dt,level)
{
	this.x=this.parent.x+this.xoff;
	this.y=this.parent.y+this.yoff;

	this.target_x=this.parent.x;
	this.target_y=this.parent.y+this.pendulum.val;

	this.pendulum.loop(simulation,dt,level,this.parent.frenzy);

	for(var ii=0;ii<this.segments.length;++ii)
	{
		this.segments[ii].left_muscle.relax();
		this.segments[ii].right_muscle.relax();
		if(this.target_x!=null&&this.target_y!=null)
			this.segments[ii].target(this.target_x-this.x,this.target_y-this.y);
		this.segments[ii].loop(simulation,dt,level);
	}
}

gary_tenticle_t.prototype.draw=function(simulation)
{
	for(var ii=0;ii<this.segments.length;++ii)
		this.segments[ii].draw(simulation);
}

function gary_segment_t(tenticle,parent)
{
	this.tenticle=tenticle;
	this.parent=parent;

	this.thickness=0;
	this.dir=0;
	this.target_dir=0;

	this.left_muscle=null;
	this.right_muscle=null;

	this.x=0;
	this.y=0;
	this.xoff=0;
	this.yoff=0;

	this.orig_color='#667331';
	this.color=this.orig_color;
}

gary_segment_t.prototype.muscle_dir=function()
{
	return (this.left_muscle.length+this.right_muscle.length)/4.0;
};

gary_segment_t.prototype.loop=function(simulation,dt,level)
{
	this.width=this.thickness;
	this.height=this.thickness;

	if(this.parent)
	{
		var origin_dir=this.parent.dir;
		var origin_dist=this.parent.muscle_dir()
		var origin_x=this.parent.xoff+Math.cos(origin_dir)*origin_dist;
		var origin_y=this.parent.yoff+Math.sin(origin_dir)*origin_dist;

		this.dir=this.parent.dir+Math.atan2(this.left_muscle.length-this.right_muscle.length,this.thickness);

		this.xoff=origin_x+Math.cos(this.dir)*this.muscle_dir();
		this.yoff=origin_y+Math.sin(this.dir)*this.muscle_dir();
	}

	this.x=this.tenticle.x+this.xoff;
	this.y=this.tenticle.y+this.yoff;

	var center_offset=-this.thickness/2;
	var check_x=this.x+level.player.width/2.0+center_offset
	var check_y=this.y-center_offset;
	if(check_collision_pos(this,check_x,check_y,level.player))
		this.color='red';
	else
		this.color=this.orig_color;
};

gary_segment_t.prototype.draw=function(simulation)
{
	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);

	simulation.ctx.lineWidth=1.7;
	simulation.ctx.strokeStyle='#000000';
	simulation.ctx.fillStyle=this.color;
	simulation.ctx.beginPath();
	simulation.ctx.arc(0,0,(this.thickness-simulation.ctx.lineWidth)/2,0,2*Math.PI,false);
	simulation.ctx.stroke();
	simulation.ctx.fill();

	simulation.ctx.restore();
}

gary_segment_t.prototype.target=function(x,y)
{
	var current_dir=normalize_radians(normalize_radians(Math.atan2(y-this.yoff,x-this.xoff))-this.dir);
	var dir_difference=normalize_radians(current_dir-this.target_dir);

	if(dir_difference<Math.PI)
	{
		var muscle_ratio=Math.min(0.15,dir_difference/Math.PI/2.0);
		this.right_muscle.length=this.right_muscle.length*(1-muscle_ratio)+this.right_muscle.min_length*muscle_ratio;
	}
	else
	{
		var muscle_ratio=Math.min(0.15,(2-dir_difference/Math.PI)/2.0);
		this.left_muscle.length=this.left_muscle.length*(1-muscle_ratio)+this.left_muscle.min_length*muscle_ratio;
	}
};

function gary_muscle_t(min_length,max_length)
{
	this.min_length=min_length;
	this.max_length=max_length;
	this.length=max_length;
	this.extend=0.90;
}

gary_muscle_t.prototype.relax=function()
{
	this.length=this.length*this.extend+this.max_length*(1-this.extend);
};

gary_muscle_t.prototype.contract=function()
{
	this.length=this.length*this.extend+this.min_length*(1-this.extend);
};