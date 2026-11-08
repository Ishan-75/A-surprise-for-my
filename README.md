# LOVE.EXE — The Ultimate Interactive Girlfriend Experience

A cinematic, interactive romantic web experience built for **Suganthi** by her boyfriend.

---

## 🎵 How to Change or Add Background Music (Fixed in Code)

Background music is configured directly in the code so your girlfriend never sees upload buttons or technical settings on the frontend:

1. **Place your audio file** (`.mp3`, `.m4a`, `.wav`, `.ogg`) into the [`public/audio/`](file:///c:/Users/Snega/Desktop/Ishan/Websites/A%20new%20web/public/audio/) folder:
   ```
   public/audio/Taylor Swift - Daylight (Official Audio)(MP3_160K).mp3
   ```
2. **Open [`src/data/playlist.js`](file:///c:/Users/Snega/Desktop/Ishan/Websites/A%20new%20web/src/data/playlist.js)** and define your song:
   ```javascript
   export const defaultPlaylist = [
     {
       id: "track-daylight",
       title: "Daylight",
       artist: "Taylor Swift",
       type: "file",
       src: "/audio/Taylor Swift - Daylight (Official Audio)(MP3_160K).mp3"
     }
   ];
   ```
3. To add more songs to the playlist, simply add more items to the array.

---

## 📸 Memory Galaxy & Photos

- **Full uncropped visibility**: Images are presented in polaroid frames using `object-contain` (`h-[360px] sm:h-[430px]`), ensuring faces and memories are never cropped out.
- **Lightbox**: Clicking any polaroid opens a full-resolution theater view.
- **Editing**: Photos and captions are safely managed in the password-protected Creator Studio (`/#creator`).

---

## 🎨 Color Palette & Aesthetic

Designed with inspiration from **Taylor Swift** (*Lover*, *Midnights*, *folklore*) and **Lana Del Rey** (*Born to Die*, *Norman Fucking Rockwell*, *Ultraviolence*):
- **Velvet Midnight Indigo**: `#090614` / `#12071e`
- **Crimson Velvet & Cherry Wine**: `#941b36` / `#b82e4f`
- **Dusty Rose**: `#ea9ab2`
- **Lavender Haze**: `#c8b6ff`
- **Champagne Starlight Gold**: `#fae19c`
- **Typography**: `Playfair Display`, `Cormorant Garamond`, `Outfit`, `Caveat`

---

## 🚀 Running the Project

```bash
# Start development server
npm.cmd run dev

# Build for production
npm.cmd run build

# Preview production build
npm.cmd run preview
```

### 🔒 Creator Studio Access
- URL: `/#creator`
- Passcodes: `1402`, `suganthi`, or `boyfriend`
