function physics_t(parent)
{
	this.parent=parent;

	this.jump=false;
	this.v_speed=0;
	this.y_velocity=0;
	this.move_with=null;
	this.moved=true;
	this.new_x=0;
}

physics_t.prototype.set_new_x=function(new_x)
{
	this.new_x=new_x;
	this.moved=true;
}

physics_t.prototype.add_new_x=function(new_x)
{
	this.new_x+=new_x;
	this.moved=true;
}

physics_t.prototype.set_jump=function()
{
	if(!this.is_falling())
	{
		this.jump=true;
		this.y_velocity=-5;
	}
}

physics_t.prototype.is_falling=function()
{
	var falling=Math.abs(this.y_velocity>2);
	return (this.jump||falling);
}

physics_t.prototype.set_move_with=function(object)
{
	if(this.move_with===object)
		return;

	if(this.move_with)
	{
		this.move_with.remove_move_with(this);
		this.move_with=null;
	}

	this.move_with=object;

	if(object)
		object.add_move_with(this);
}

physics_t.prototype.loop=function(simulation,dt,level)
{
	//Check for Under Collision
	var collision=false;
	var check_sensitivity=1;
	var new_y=this.parent.y;
	if(Math.abs(this.y_velocity)>1)
		new_y=this.parent.y+this.y_velocity
	var y_velocity_multiplier=1;
	if(this.y_velocity<0)
		y_velocity_multiplier=-1;

	//Falling Collisions with Blocks
	if(this.y_velocity!=0)
		for(var ii=0;ii<level.blocks.length;++ii)
		{
			if(collision)
				break;
			for(var dist=0;dist<Math.abs(this.y_velocity);dist+=check_sensitivity)
			{
				var check_x=this.parent.x-this.parent.width/2;
				var check_y=this.parent.y+dist*y_velocity_multiplier;
				if(check_collision_pos(this.parent,check_x,check_y,level.blocks[ii]))
				{
					var block_top=level.blocks[ii].y-level.blocks[ii].height;

					if(this.parent.y<=block_top+this.y_velocity)
					{
						this.parent.y=block_top;
						this.jump=false;
					}
					else
						this.parent.y=check_y+check_sensitivity;
					collision=true;
					this.y_velocity=0;
					y_velocity_multiplier=0;
					break;
				}
			}
		}

	//Falling Collisions with Hovers (Under player only)
	if(this.y_velocity>0)
		for(var ii=0;ii<level.hovers.length;++ii)
		{
			if(collision)
				break;
			for(var dist=0;dist<this.y_velocity;dist+=check_sensitivity)
				if(check_collision_beneath_pos(this.parent,this.parent.x-this.parent.width/2,this.parent.y+dist*y_velocity_multiplier,level.hovers[ii]))
				{
					this.parent.y=level.hovers[ii].y-level.hovers[ii].height;
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
		this.parent.y=new_y;
		this.y_velocity+=9.8*dt;
	}
	if(this.y_velocity>100)
		this.y_velocity=100;
	if(this.y_velocity<-100)
		this.y_velocity=-100;

	//Move left/right
	if(this.moved)
	{
		var collision=false;

		//We Move Based Collisions with Blocks
		for(var ii=0;ii<level.blocks.length;++ii)
			if(check_collision_pos(this.parent,this.parent.x+this.new_x-this.parent.width/2,this.parent.y,level.blocks[ii]))
			{
				collision=true;
				break;
			}

		if(!collision)
			this.parent.x+=this.new_x;

		this.moved=false;
		this.new_x=0;
	}

	if(this.is_falling())
		this.set_move_with(null);
}