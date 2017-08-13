function player_t(x,y)
{
	var _this=this;

	_this.x=x;
	_this.y=y;
	_this.width=0;
	_this.height=0;
	_this.height_offset=0;
	_this.spr_idle=new sprite_t("player_idle.png",1);
	_this.spr_move=new sprite_t("player_move.png",4);
	_this.spr_jump=new sprite_t("player_jump.png",1);
	_this.spr=_this.spr_idle;
	_this.speed=100;
	_this.animation_speed=8;
	_this.jump=false;
	_this.direction=1;
	_this.v_speed=0;
	_this.y_velocity=0;
	_this.move_with=null;



	_this.loop=function(simulation,dt,level)
	{
		if(!simulation)
			return;

		_this.width=22;
		_this.height=Math.max(_this.spr_idle.height,_this.spr_move.height,_this.spr_jump.height);
		_this.height_offset=0;

		//Check for Under Collision
		var collision=false;
		var check_sensitivity=1;
		var new_y=_this.y+_this.y_velocity;
		if(Math.abs(_this.y_velocity)<1)
			new_y=_this.y;
		var y_velocity_multiplier=1;
		if(_this.y_velocity<0)
			y_velocity_multiplier=-1;

		//Falling Collisions with Crates
		if(_this.y_velocity!=0)
			for(var ii=0;ii<level.crates.length;++ii)
			{
				if(collision)
					break;
				for(var dist=0;dist<Math.abs(_this.y_velocity);dist+=check_sensitivity)
					if(check_collision_pos(_this,_this.x,_this.y+dist*y_velocity_multiplier,level.crates[ii]))
					{
						_this.y=Math.round(level.crates[ii].y+get_top(level.crates[ii])-_this.height/2.0)-y_velocity_multiplier;
						collision=true;
						_this.y_velocity=0;
						y_velocity_multiplier=0;
						_this.jump=false;
						break;
					}
			}

		//Falling Collisions with Hovers (Under player only)
		if(_this.y_velocity>0)
			for(var ii=0;ii<level.hovers.length;++ii)
			{
				if(collision)
					break;
				for(var dist=0;dist<_this.y_velocity;dist+=check_sensitivity)
					if(check_collision_beneath_pos(_this,_this.x,_this.y+dist,level.hovers[ii]))
					{
						_this.y=Math.round(level.hovers[ii].y+get_top(level.hovers[ii])-_this.height/2.0)-y_velocity_multiplier;
						collision=true;
						_this.y_velocity=0;
						_this.jump=false;
						_this.set_move_with(level.hovers[ii]);
						break;
					}
				}

		if(!collision)
		{
			_this.y=new_y;
			_this.y_velocity+=9.8*dt;
		}
		if(_this.y_velocity>100)
			_this.y_velocity=100;
		if(_this.y_velocity<-100)
			_this.y_velocity=-100;

		//Move Left/Right
		var moved=false;
		var new_x=x;
		if(simulation.keys_down[kb_right]&&!simulation.keys_down[kb_left])
		{
			moved=true;
			_this.direction=1;
			new_x=_this.x+_this.speed*dt*_this.direction;
		}
		if(!simulation.keys_down[kb_right]&&simulation.keys_down[kb_left])
		{
			moved=true;
			_this.direction=-1;
			new_x=_this.x+_this.speed*dt*_this.direction;
		}
		if(moved)
		{
			var collision=false;

			//We Move Based Collisions with Crates
			for(var ii=0;ii<level.crates.length;++ii)
				if(check_collision_pos(_this,new_x,_this.y,level.crates[ii]))
				{
					collision=true;
					break;
				}

			if(!collision)
				_this.x=new_x;
		}

		//Jump
		var falling=Math.abs(_this.y_velocity>2);
		if(simulation.keys_pressed[kb_up]&&!_this.jump&&!falling)
		{
			_this.jump=true;
			_this.y_velocity=-8;
		}
		if(_this.jump||falling)
		{
			_this.spr=_this.spr_jump;
			_this.spr.x_scale=_this.direction;
			_this.set_move_with(null);
		}
		else
		{
			if(moved)
			{
				_this.spr=_this.spr_move;
				_this.spr.frame+=_this.animation_speed*dt;
			}
			else
			{
				_this.spr=_this.spr_idle;
			}

			_this.spr.x_scale=_this.direction;
		}
	};

	_this.draw=function(simulation)
	{
		if(!simulation)
			return;

		simulation.ctx.save();
		simulation.ctx.translate(_this.x,_this.y);
		_this.spr.draw(simulation);
		simulation.ctx.restore();
	};

	_this.set_move_with=function(object)
	{
		if(_this.move_with===object)
			return;

		if(_this.move_with)
		{
			_this.move_with.move_with=null;
			_this.move_with=null;
		}

		_this.move_with=object;

		if(object)
			object.move_with=_this;
	}
};