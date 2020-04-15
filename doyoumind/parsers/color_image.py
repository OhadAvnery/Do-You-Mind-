from PIL import Image 

def parse_color_image(context, snapshot):
    path = context.path('color_image.jpg')
    size = snapshot.color_image.width, snapshot.color_image.height
    #image = Image.new('RGB', size)
    #image.putdata(snapshot.color_image.data)
    image = Image.frombytes('RGB', size, snapshot.color_image.data)
    image.save(path) 

parse_color_image.fields = ['color_image']

