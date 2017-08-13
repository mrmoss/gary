function player_t(x,y)
{
	var _this=this;

	_this.x=x;
	_this.y=y;
	_this.spr_idle=new sprite_t("player_idle.png",1);
	_this.spr_move=new sprite_t("player_move.png",4);
	_this.spr_jump=new sprite_t("player_jump.png",1);
	_this.spr=_this.spr_idle;
	_this.speed=100;
	_this.animation_speed=10;
	_this.jump=false;
	_this.direction=1;
	_this.bb={width:0,height:0};
	_this.v_speed=0;
	_this.y_velocity=0;
	_this.move_with=null;

	_this.loop=function(simulation,dt,level)
	{
		if(!simulation)
			return;

		//Check for Under Collision
		var collision=false;
		var new_y=_this.y+_this.y_velocity;

		var check_under_collision=function(objects,move_with)
		{
			for(var ii=0;ii<objects.length;++ii)
			{
				if(_this.x+_this.bb.width/2.0>=objects[ii].x-objects[ii].spr.width/2.0&&
					_this.x-_this.bb.width/2.0<=objects[ii].x+objects[ii].spr.width/2.0&&
					new_y+_this.bb.height/2.0>=objects[ii].y-objects[ii].height/2.0-objects[ii].height_offset&&
					new_y-_this.bb.height/2.0<=objects[ii].y+objects[ii].height/2.0-objects[ii].height_offset)
				{
					collision=true;
					_this.y_velocity=0;
					_this.jump=false;

					if(move_with)
						_this.set_move_with(objects[ii]);
				}
			}
		}
		check_under_collision(level.crates,false);
		check_under_collision(level.hovers,true);
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

			var check_move_collisions=function(objects,move_with)
			{
				for(var ii=0;ii<objects.length;++ii)
				{
					if(new_x+_this.bb.width/2.0>=objects[ii].x-objects[ii].spr.width/2.0&&
						new_x-_this.bb.width/2.0<=objects[ii].x+objects[ii].spr.width/2.0&&
						_this.y+_this.bb.height/2.0>=objects[ii].y-objects[ii].height/2.0-objects[ii].height_offset&&
						_this.y-_this.bb.height/2.0<=objects[ii].y+objects[ii].height/2.0-objects[ii].height_offset)
					{
						collision=true;

						if(move_with)
							_this.set_move_with(objects[ii]);

						break;
					}
				}
			}
			check_move_collisions(level.crates,false);
			check_move_collisions(level.hovers,true);

			if(!collision)
				_this.x=new_x;
		}

		//Jump
		var falling=Math.abs(_this.y_velocity>1);
		if(simulation.keys_pressed[kb_up]&&!_this.jump&&!falling)
		{
			_this.jump=true;
			_this.y_velocity=-5;
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

		_this.bb.width=22;
		_this.bb.height=Math.max(_this.spr_idle.height,_this.spr_move.height,_this.spr_jump.height);

		simulation.ctx.save();
		simulation.ctx.translate(_this.x,_this.y);
		_this.spr.draw(simulation);
		simulation.ctx.restore();
	};

	_this.set_move_with=function(object)
	{
		if(_this.move_with===object)
			return;

		if(!_this.move_with&&object)
			_this.x+=object.direction*5;

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