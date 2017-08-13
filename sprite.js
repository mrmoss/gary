function sprite_t(source,frames)
{
	this.image=new Image();
	this.image.src=source;
	this.frame=0;
	this.frame_count=frames;
	this.x_scale=1;
	this.y_scale=1;
	this.width=this.image.width/this.frame_count;
	this.height=this.image.height;
	this.center_x=false;
}

sprite_t.prototype.draw=function(simulation)
{
	if(this.center_x)
	{
		simulation.ctx.save();
		simulation.ctx.translate(this.width/2,0);
	}

	if(this.frame>=this.frame_count)
		this.frame=0;

	this.width=this.image.width/this.frame_count;
	this.height=this.image.height;

	if(!simulation)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(0,-(this.height*this.y_scale));
	if(this.center_x)
		simulation.ctx.translate(-(this.width/2.0*this.x_scale),0);
	simulation.ctx.scale(this.x_scale,this.y_scale);

	simulation.ctx.drawImage(this.image,
		Math.round(Math.floor(this.frame)*this.width),
		0,
		this.width,
		this.height,
		0,
		0,
		this.width,
		this.height);

	simulation.ctx.restore();

	if(this.center_x)
		simulation.ctx.restore();
}