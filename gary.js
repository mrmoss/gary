function gary_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr=new sprite_t('gary.png',2);
	this.spr_eye=new sprite_t('eye.png',1);
	this.dir=1;

	this.eyes=[new gary_eye_t(this),new gary_eye_t(this)];
	this.eyes[0].xoff=-3;
	this.eyes[0].yoff=-35;
	this.eyes[0].max_dist=2;
	this.eyes[1].xoff=0;
	this.eyes[1].yoff=-16.5;
	this.eyes[1].max_dist=2.5;

	this.tenticles=[];
	this.tenticles.push(new gary_tenticle_t(this, 18,-10,0,1));
	this.tenticles.push(new gary_tenticle_t(this, 15,-20,-Math.PI/4,-1));

	this.tenticles.push(new gary_tenticle_t(this,-18,-10,Math.PI,1));
	this.tenticles.push(new gary_tenticle_t(this,-15,-20,-3*Math.PI/4,-1));
};

gary_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=22;
	this.height=this.spr.height;

	for(var ii=0;ii<this.eyes.length;++ii)
		this.eyes[ii].loop(simulation,dt,level);

	for(var ii=0;ii<this.tenticles.length;++ii)
		this.tenticles[ii].loop(simulation,dt,level);
};

gary_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

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

	for(var ii=0;ii<this.tenticles.length;++ii)
		this.tenticles[ii].draw(simulation);
};

//http://www.zarkonnen.com/airships/tentacle_logic
function gary_tenticle_t(gary,xoff,yoff,dir,dir_multiplier)
{
	this.gary=gary;

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

	this.x=this.gary.x+this.xoff;
	this.y=this.gary.y+this.yoff;

	this.segments=[];
	this.target_x=0;
	this.target_y=0;
	this.target_off=0;
	this.target_max=200;
	this.target_inc=1000*dir_multiplier;

	var num_segments=15;
	var thickness=8;
	var total_length=0;
	var parent=null;

	for(var ii=0;ii<num_segments;++ii)
	{
		parent=new gary_segment_t(this,parent);

		parent.thickness=thickness;
		parent.dir=dir;
		parent.target_dir=Math.PI/2.0/num_segments*ii*dir_multiplier;

		var length=8-ii/2.0;
		parent.left_muscle=new gary_muscle_t(length/2.0,length);
		parent.right_muscle=new gary_muscle_t(length/2.0,length);

		parent.xoff=total_length;
		parent.yoff=0;

		this.segments.push(parent);

		thickness=thickness*0.92;
		total_length+=length;
	}

}

gary_tenticle_t.prototype.loop=function(simulation,dt,level)
{
	this.x=this.gary.x+this.xoff;
	this.y=this.gary.y+this.yoff;

	this.target_x=this.gary.x;
	this.target_y=this.gary.y+this.target_off;
	this.target_off+=this.target_inc*dt;
	if(this.target_off>this.target_max)
	{
		this.target_off=this.target_max;
		this.target_inc=-Math.abs(this.target_inc);
	}
	if(this.target_off<-this.target_max)
	{
		this.target_off=-this.target_max;
		this.target_inc=Math.abs(this.target_inc);
	}

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

	if(check_collision_pos({width:this.thickness,height:this.thickness},this.x+level.player.width/2.0,this.y,level.player))
		this.color='red';
	else
		this.color=this.orig_color;
};

gary_segment_t.prototype.draw=function(simulation)
{
	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);

	simulation.ctx.fillStyle="#000000";
	simulation.ctx.beginPath();
	simulation.ctx.arc(0,0,this.thickness/2,0,2*Math.PI,false);
	simulation.ctx.fill();

	simulation.ctx.fillStyle=this.color;
	simulation.ctx.beginPath();
	simulation.ctx.arc(0,0,(this.thickness-1)/2,0,2*Math.PI,false);
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

function gary_eye_t(gary)
{
	this.gary=gary;
	this.xoff=0;
	this.yoff=0;
	this.max_dist=0;
	this.xlook=0;
	this.ylook=0;
}

gary_eye_t.prototype.calculate_dists=function()
{
	var dists={};
	dists.gary_width=this.gary.spr.width*this.gary.spr.x_scale;
	dists.x=this.gary.x+this.xoff;
	dists.y=this.gary.y+this.yoff;
	dists.spr_width=this.gary.spr_eye.width*this.gary.spr_eye.x_scale;
	dists.spr_height=this.gary.spr_eye.height*this.gary.spr_eye.y_scale;
	return dists;
}

gary_eye_t.prototype.loop=function(simulation,dt,level)
{
	var dists=this.calculate_dists();

	var dir=point_direction(dists.x,dists.y,level.player.x,level.player.y);

	var dist=Math.min(this.max_dist,point_distance(dists.x,dists.y,level.player.x,level.player.y)/50.0);

	this.xlook=dist*Math.cos(dir);
	this.ylook=dist*Math.sin(dir);
}

gary_eye_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	var dists=this.calculate_dists();

	simulation.ctx.save();
	simulation.ctx.translate(dists.x+this.xlook-dists.spr_width/2.0,dists.y+this.ylook-dists.spr_height/2.0);
	this.gary.spr_eye.draw(simulation);
	simulation.ctx.restore();
}