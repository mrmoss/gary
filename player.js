function player_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr_idle=new sprite_t("player_idle.png",1);
	this.spr_move=new sprite_t("player_move.png",4);
	this.spr_jump=new sprite_t("player_jump.png",1);
	this.spr=this.spr_idle;
	this.speed=100;
	this.animation_speed=8;
	this.jump=false;
	this.direction=1;
	this.v_speed=0;
	this.y_velocity=0;
	this.move_with=null;
};

player_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=22;
	this.height=Math.max(this.spr_idle.height,this.spr_move.height,this.spr_jump.height);

	//Check for Under Collision
	var collision=false;
	var check_sensitivity=1;
	var new_y=this.y;
	if(Math.abs(this.y_velocity)>1)
		new_y=this.y+this.y_velocity
	var y_velocity_multiplier=1;
	if(this.y_velocity<0)
		y_velocity_multiplier=-1;

	//Falling Collisions with Crates
	if(this.y_velocity!=0)
		for(var ii=0;ii<level.crates.length;++ii)
		{
			if(collision)
				break;
			for(var dist=0;dist<Math.abs(this.y_velocity);dist+=check_sensitivity)
				if(check_collision_pos(this,this.x,this.y+dist*y_velocity_multiplier,level.crates[ii]))
				{
					this.y=level.crates[ii].y-level.crates[ii].height;
					collision=true;
					this.y_velocity=0;
					y_velocity_multiplier=0;
					this.jump=false;
					break;
				}
		}

	//Falling Collisions with Hovers (Under player only)
	if(this.y_velocity>0)
		for(var ii=0;ii<level.hovers.length;++ii)
		{
			if(collision)
				break;
			for(var dist=0;dist<this.y_velocity;dist+=check_sensitivity)
				if(check_collision_beneath_pos(this,this.x,this.y+dist*y_velocity_multiplier,level.hovers[ii]))
				{
					this.y=level.hovers[ii].y-level.hovers[ii].height;
					collision=true;
					this.y_velocity=0;
					y_velocity_multiplier=0;
					this.jump=false;
					this.set_move_with(level.hovers[ii]);
					break;
				}
			}

	if(!collision)
	{
		this.y=new_y;
		this.y_velocity+=9.8*dt;
	}
	if(this.y_velocity>100)
		this.y_velocity=100;
	if(this.y_velocity<-100)
		this.y_velocity=-100;

	//Move Left/Right
	var moved=false;
	var new_x=this.x;
	if(simulation.keys_down[kb_right]&&!simulation.keys_down[kb_left])
	{
		moved=true;
		this.direction=1;
		new_x=this.x+this.speed*dt*this.direction;
	}
	if(!simulation.keys_down[kb_right]&&simulation.keys_down[kb_left])
	{
		moved=true;
		this.direction=-1;
		new_x=this.x+this.speed*dt*this.direction;
	}
	if(moved)
	{
		var collision=false;

		//We Move Based Collisions with Crates
		for(var ii=0;ii<level.crates.length;++ii)
			if(check_collision_pos(this,new_x,this.y,level.crates[ii]))
			{
				collision=true;
				break;
			}

		if(!collision)
			this.x=new_x;
	}

	//Jump
	var falling=Math.abs(this.y_velocity>2);
	if(simulation.keys_pressed[kb_up]&&!this.jump&&!falling)
	{
		this.jump=true;
		this.y_velocity=-5;
	}
	if(this.jump||falling)
	{
		this.spr=this.spr_jump;
		this.spr.x_scale=this.direction;
		this.set_move_with(null);
	}
	else
	{
		if(moved)
		{
			this.spr=this.spr_move;
			this.spr.frame+=this.animation_speed*dt;
		}
		else
		{
			this.spr=this.spr_idle;
		}

		this.spr.x_scale=this.direction;
	}
};

player_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.center_x=true;
	this.spr.draw(simulation);
	simulation.ctx.restore();
};

player_t.prototype.set_move_with=function(object)
{
	if(this.move_with===object)
		return;

	if(this.move_with)
	{
		this.move_with.move_with=null;
		this.move_with=null;
	}

	this.move_with=object;

	if(object)
		object.move_with=this;
}