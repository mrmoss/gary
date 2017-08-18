function sprite_t(source,frames,x_centered,y_centered)
{
	this.image=new Image();
	this.image.src=source;
	this.frame=0;
	this.frame_count=frames;
	if(!frames)
		this.frame_count=1;
	this.x_scale=1;
	this.y_scale=1;
	this.width=this.image.width/this.frame_count;
	this.height=this.image.height;
	this.x_centered=x_centered;
	if(!x_centered)
		this.x_centered=false;
	this.y_centered=y_centered;
	if(!y_centered)
		this.y_centered=false;
}

sprite_t.prototype.draw=function(simulation)
{
	if(this.frame>=this.frame_count)
		this.frame=0;

	this.width=this.image.width/this.frame_count;
	this.height=this.image.height;

	if(!simulation)
		return;

	var xoff=0;
	if(this.x_centered)
		xoff=-this.width/2.0*this.x_scale;

	var yoff=-this.height*this.y_scale;
	if(this.y_centered)
		yoff+=this.height/2.0*this.y_scale

	simulation.ctx.save();
	simulation.ctx.translate(xoff,yoff);
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
}