from PIL import Image
import glob
import os

# Get all frames sorted
all_frames = sorted(glob.glob('artifacts/frames/frame_*.png'))
print(f'Found {len(all_frames)} total frames')

# Version 1: Optimized (every other frame, 128 colors)
print('\nCreating optimized version...')
frames_opt = []
for path in all_frames[::2]:
    img = Image.open(path)
    img = img.convert('P', palette=Image.ADAPTIVE, colors=128)
    frames_opt.append(img)

output_opt = 'artifacts/linkedin-background-animated-optimized.gif'
frames_opt[0].save(
    output_opt,
    save_all=True,
    append_images=frames_opt[1:],
    duration=150,
    loop=0,
    optimize=True
)
size_opt = os.path.getsize(output_opt)
print(f'  -> {output_opt}: {size_opt / 1024:.1f} KB')

# Version 2: Small (every 3rd frame, 64 colors)
print('\nCreating small version...')
frames_small = []
for path in all_frames[::3]:
    img = Image.open(path)
    img = img.convert('P', palette=Image.ADAPTIVE, colors=64)
    frames_small.append(img)

output_small = 'artifacts/linkedin-background-animated-small.gif'
frames_small[0].save(
    output_small,
    save_all=True,
    append_images=frames_small[1:],
    duration=200,
    loop=0,
    optimize=True
)
size_small = os.path.getsize(output_small)
print(f'  -> {output_small}: {size_small / 1024:.1f} KB')

print('\nDone!')
