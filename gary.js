function gary_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr=new sprite_t('gary.png',2);
	this.spr_eye=new sprite_t('eye.png',1);
	this.spr_tenticle=new sprite_t('tenticle.png',1);
	this.direction=1;

	this.eyes=[new gary_eye(this),new gary_eye(this)];
	this.eyes[0].xoff=-3;
	this.eyes[0].yoff=-35;
	this.eyes[0].max_dist=2;
	this.eyes[1].xoff=0;
	this.eyes[1].yoff=-16.5;
	this.eyes[1].max_dist=2.5;

	this.tenticle=new tenticle_t(this);
};

gary_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=22;
	this.height=this.spr.height;

	for(var ii=0;ii<this.eyes.length;++ii)
		this.eyes[ii].loop(simulation,dt,level);


	this.tenticle.target_x=level.player.x;
	this.tenticle.target_y=level.player.y-level.player.height/2;
	this.tenticle.loop(simulation,dt,level);
};

gary_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	this.tenticle.draw(simulation);

	var spr_width=this.spr.width*this.spr.x_scale;

	simulation.ctx.save();
	simulation.ctx.translate(this.x-spr_width/2.0,this.y);
	this.spr.frame=1;
	this.spr.draw(simulation);
	simulation.ctx.restore();

	for(var ii=0;ii<this.eyes.length;++ii)
		this.eyes[ii].draw(simulation);

	simulation.ctx.save();
	simulation.ctx.translate(this.x-spr_width/2.0,this.y);
	this.spr.frame=0;
	this.spr.draw(simulation);
	simulation.ctx.restore();
};






function gary_eye(gary)
{
	this.gary=gary;
	this.xoff=0;
	this.yoff=0;
	this.max_dist=0;
	this.xlook=0;
	this.ylook=0;
}

gary_eye.prototype.calculate_dists=function()
{
	var dists={};
	dists.gary_width=this.gary.spr.width*this.gary.spr.x_scale;
	dists.x=this.gary.x+this.xoff;
	dists.y=this.gary.y+this.yoff;
	dists.spr_width=this.gary.spr_eye.width*this.gary.spr_eye.x_scale;
	dists.spr_height=this.gary.spr_eye.height*this.gary.spr_eye.y_scale;
	return dists;
}

gary_eye.prototype.loop=function(simulation,dt,level)
{
	var dists=this.calculate_dists();

	var direction=point_direction(dists.x,dists.y,level.player.x,level.player.y);

	var dist=Math.min(this.max_dist,point_distance(dists.x,dists.y,level.player.x,level.player.y)/50.0);

	this.xlook=dist*Math.cos(direction);
	this.ylook=dist*Math.sin(direction);
}

gary_eye.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	var dists=this.calculate_dists();

	simulation.ctx.save();
	simulation.ctx.translate(dists.x+this.xlook-dists.spr_width/2.0,dists.y+this.ylook-dists.spr_height/2.0);
	this.gary.spr_eye.draw(simulation);
	simulation.ctx.restore();
}




















function muscle_t(min_length,max_length)
{
	this.min_length=min_length;
	this.max_length=max_length;
	this.length=max_length;
	this.extend=0.90;
}
muscle_t.prototype.relax=function()
{
	this.length=this.length*this.extend+this.max_length*(1-this.extend);
};
muscle_t.prototype.contract=function()
{
	this.length=this.length*this.extend+this.min_length*(1-this.extend);
};





function segment_t(thickness,left_muscle,right_muscle,x_center,y_center,angle,target_angle)
{
	this.thickness=thickness;
	this.left_muscle=left_muscle;
	this.right_muscle=right_muscle;
	this.x_center=x_center;
	this.y_center=y_center;
	this.angle=angle;
	this.target_angle=target_angle;
}
segment_t.prototype.muscle_direction=function()
{
	return (this.left_muscle.length+this.right_muscle.length)/2.0;
};
segment_t.prototype.updatePosition=function(previous)
{
	var origin_x=previous.x_center+Math.cos(previous.angle)*previous.muscle_direction()/2.0;
	var origin_y=previous.y_center+Math.sin(previous.angle)*previous.muscle_direction()/2.0;
	var relative_angle=Math.atan2(this.left_muscle.length-this.right_muscle.length,this.thickness);
	this.angle=previous.angle+relative_angle;
	this.x_center=origin_x+Math.cos(this.angle)*this.muscle_direction()/2.0;
	this.y_center=origin_y+Math.sin(this.angle)*this.muscle_direction()/2.0;
};
segment_t.prototype.target=function(x,y)
{
	var current_angle=normalize_radians(normalize_radians(Math.atan2(y-this.y_center,x-this.x_center))-this.angle);
	var angle_difference=normalize_radians(current_angle-this.target_angle);

	if(angle_difference<Math.PI)
	{
		var muscle_ratio=Math.min(0.15,angle_difference/Math.PI/2.0);
		this.right_muscle.length=this.right_muscle.length*(1-muscle_ratio)+this.right_muscle.min_length*muscle_ratio;
	}
	else
	{
		var muscle_ratio=Math.min(0.15,(2-angle_difference/Math.PI)/2.0);
		this.left_muscle.length=this.left_muscle.length*(1-muscle_ratio)+this.left_muscle.min_length*muscle_ratio;
	}
};






//http://www.zarkonnen.com/airships/tentacle_logic
function tenticle_t(gary)
{
	this.gary=gary;

	this.xoff=10;
	this.yoff=-10;

	this.segments=[];
	this.target_x=null;
	this.target_y=null;

	var total_length=0;
	var num_segments=10;
	for(var ii=0;ii<num_segments;++ii)
	{
		var thickness=(num_segments-ii)*2;
		var length=10-ii/2.0;
		var target_angle=Math.PI/2.0/num_segments*ii;
		var left_muscle=new muscle_t(length/2.0,length);
		var right_muscle=new muscle_t(length/2.0,length);
		this.segments.push(new segment_t(thickness,left_muscle,right_muscle,total_length,0,0,target_angle));
		total_length+=length;
	}

}

tenticle_t.prototype.loop=function(simulation,dt,level)
{
	for(var ii=0;ii<this.segments.length;++ii)
	{
		this.segments[ii].left_muscle.relax();
		this.segments[ii].right_muscle.relax();
		if(this.target_x!=null&&this.target_y!=null)
			this.segments[ii].target(this.target_x-this.gary.x-this.xoff,this.target_y-this.gary.y-this.yoff);
		if(ii>0)
			this.segments[ii].updatePosition(this.segments[ii-1]);
	}
}

tenticle_t.prototype.draw=function(simulation)
{
	simulation.ctx.save();
	simulation.ctx.translate(this.gary.x+this.xoff,this.gary.y+this.yoff);

	for(var ii=0;ii<this.segments.length;++ii)
	{
		simulation.ctx.save();
		simulation.ctx.translate(this.segments[ii].x_center,this.segments[ii].y_center);
		simulation.ctx.rotate(this.segments[ii].angle);

		var x=-this.segments[ii].muscle_direction();
		var y=-this.segments[ii].thickness/2.0;
		var w=this.segments[ii].muscle_direction()+2;
		var h=this.segments[ii].thickness;

		simulation.ctx.fillStyle="#000000";
		simulation.ctx.fillRect(x,y,w,h);
		h-=1;
		y+=0.5;
		simulation.ctx.fillStyle="#667331";
		simulation.ctx.fillRect(x,y,w,h);
		simulation.ctx.restore();
	}

	simulation.ctx.restore();
}