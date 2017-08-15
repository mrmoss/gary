function player_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.dir=1;
	this.spr_idle=new sprite_t('player_idle.png',1);
	this.spr_move=new sprite_t('player_move.png',4);
	this.spr_jump=new sprite_t('player_jump.png',1);
	this.spr=this.spr_idle;
	this.speed=100;
	this.animation_speed=8;

	this.physics=new physics_t(this);
};

player_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=20;
	this.height=Math.max(this.spr_idle.height,this.spr_move.height,this.spr_jump.height);

	this.physics.loop(simulation,dt,level);

	if(simulation.keys_down[kb_right]&&!simulation.keys_down[kb_left])
	{
		this.dir=1;
		this.physics.set_new_x(this.speed*dt);
	}
	if(!simulation.keys_down[kb_right]&&simulation.keys_down[kb_left])
	{
		this.dir=-1;
		this.physics.set_new_x(-this.speed*dt);
	}

	if(simulation.keys_pressed[kb_up])
		this.physics.set_jump();
	if(this.physics.is_falling())
	{
		this.spr=this.spr_jump;
		this.spr.x_scale=this.dir;
	}
	else
	{
		if(this.physics.moved)
		{
			this.spr=this.spr_move;
			this.spr.frame+=this.animation_speed*dt;
		}
		else
		{
			this.spr=this.spr_idle;
		}

		this.spr.x_scale=this.dir;
	}
};

player_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(this.x-this.spr.width/2.0*this.spr.x_scale,this.y);
	this.spr.draw(simulation);
	simulation.ctx.restore();
};