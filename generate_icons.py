from PIL import Image, ImageDraw

def create_icon(size, filename):
    # Create image with high-contrast, modern gradient-like background
    img = Image.new("RGBA", (size, size), (15, 23, 42, 255)) # slate-900
    draw = ImageDraw.Draw(img)

    # Outer rounded glow / circle
    margin = int(size * 0.08)
    # Circle gradient approximation
    draw.ellipse([margin, margin, size - margin, size - margin], fill=(30, 41, 59, 255), outline=(99, 102, 241, 255), width=int(size * 0.03))
    
    # Inner accent circle
    inner_margin = int(size * 0.16)
    draw.ellipse([inner_margin, inner_margin, size - inner_margin, size - inner_margin], fill=(15, 23, 42, 255), outline=(139, 92, 246, 255), width=int(size * 0.02))

    # Lightning / Recurrence bell symbol in center
    # Draw recurring arrows or bell
    cx, cy = size // 2, size // 2
    r = int(size * 0.22)
    
    # Draw checkmark and bell accent
    # Flame / lightning shape in bright violet/amber
    pts = [
        (cx - int(r*0.2), cy - r),
        (cx + int(r*0.6), cy - int(r*0.2)),
        (cx + int(r*0.05), cy - int(r*0.1)),
        (cx + int(r*0.3), cy + r),
        (cx - int(r*0.6), cy + int(r*0.1)),
        (cx - int(r*0.05), cy + int(r*0.05))
    ]
    draw.polygon(pts, fill=(168, 85, 247, 255)) # purple-500
    
    # Ring / bell bottom accent dot
    dot_r = max(2, int(size * 0.04))
    draw.ellipse([cx - dot_r, cy + int(r*0.6) - dot_r, cx + dot_r, cy + int(r*0.6) + dot_r], fill=(236, 72, 153, 255))

    img.save(filename, "PNG")
    print(f"Generated {filename} ({size}x{size})")

create_icon(192, "icons/icon-192.png")
create_icon(512, "icons/icon-512.png")
create_icon(180, "icons/apple-touch-icon.png")
