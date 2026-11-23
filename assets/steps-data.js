// Step-by-step drawings for Yaanstep Sprouts (SCRUM-515). Each step adds the next line or a few small details. Drawn by Yaanstep, 2026.
window.YS_STEPS = [
  { id: 'face', name: 'Happy face', group: 'People', level: 1, steps: [
      { say: 'Draw a big circle for the face.', d: ['M200 24 A176 176 0 0 0 47.6 288 A176 176 0 0 0 352.4 288 A176 176 0 0 0 200 24'] },
      { say: 'Add two small ovals for eyes.', d: ['M144.7 125.6 A14.1 24.1 0 0 0 132.5 161.8 A14.1 24.1 0 0 0 156.9 161.8 A14.1 24.1 0 0 0 144.7 125.6', 'M255.3 125.6 A14.1 24.1 0 0 0 243.1 161.8 A14.1 24.1 0 0 0 267.5 161.8 A14.1 24.1 0 0 0 255.3 125.6'] },
      { say: 'Draw a big smile under the eyes.', d: ['M114.5 235.2 Q200 320.7 285.5 235.2'] },
      { say: 'Add two small circles for rosy cheeks.', d: ['M87.4 186.9 A18.1 18.1 0 0 0 71.7 214.1 A18.1 18.1 0 0 0 103 214.1 A18.1 18.1 0 0 0 87.4 186.9', 'M312.6 186.9 A18.1 18.1 0 0 0 297 214.1 A18.1 18.1 0 0 0 328.3 214.1 A18.1 18.1 0 0 0 312.6 186.9'] },
      { say: 'Your happy face is ready. Now color it in!', d: [] }
  ] },
  { id: 'heart', name: 'Heart', group: 'Things', level: 1, steps: [
      { say: 'Draw a curvy line up from the bottom to make the left bump.', d: ['M200 360.5 C148.2 319.1 24 246.6 24 143.1 C24 70.6 75.8 39.5 117.2 39.5 C158.6 39.5 189.6 70.6 200 101.6'] },
      { say: 'Draw the same curve on the right side.', d: ['M200 101.6 C210.4 70.6 241.4 39.5 282.8 39.5 C324.2 39.5 376 70.6 376 143.1 C376 246.6 251.8 319.1 200 360.5'] },
      { say: 'Add a small curve inside for a shiny spot.', d: ['M75.8 153.4 Q77.8 103.7 117.2 91.3'] },
      { say: 'Your heart is ready. Now color it in!', d: [] }
  ] },
  { id: 'balloon', name: 'Balloon', group: 'Things', level: 1, steps: [
      { say: 'Draw a big oval for the balloon.', d: ['M200 24 A107.9 131.4 0 0 0 106.5 221.1 A107.9 131.4 0 0 0 293.5 221.1 A107.9 131.4 0 0 0 200 24'] },
      { say: 'Add a tiny triangle under it for the knot.', d: ['M200 286.8 L185 307.5 L215 307.5 L200 286.8'] },
      { say: 'Draw a long wavy line down for the string.', d: ['M200 307.5 C237.5 329.1 162.5 347.8 200 376'] },
      { say: 'Add a small curve near the top for a shiny spot.', d: ['M134.3 136.6 Q139 91.6 171.8 70.9'] },
      { say: 'Your balloon is ready. Now color it in!', d: [] }
  ] },
  { id: 'sun', name: 'Sun', group: 'Nature', level: 1, steps: [
      { say: 'Draw a big circle in the middle.', d: ['M200 104 A96 96 0 0 0 116.9 248 A96 96 0 0 0 283.1 248 A96 96 0 0 0 200 104'] },
      { say: 'Draw four long lines for rays: up, down, left and right.', d: ['M200 80.5 L200 24', 'M319.5 200 L376 200', 'M200 319.5 L200 376', 'M80.5 200 L24 200'] },
      { say: 'Add four more rays in between.', d: ['M284.5 115.5 L314.7 85.3', 'M284.5 284.5 L314.7 314.7', 'M115.5 284.5 L85.3 314.7', 'M115.5 115.5 L85.3 85.3'] },
      { say: 'Draw two dots for eyes and a happy smile.', d: ['M165.9 176 A4.8 4.8 0 0 0 161.7 183.2 A4.8 4.8 0 0 0 170 183.2 A4.8 4.8 0 0 0 165.9 176', 'M234.1 176 A4.8 4.8 0 0 0 230 183.2 A4.8 4.8 0 0 0 238.3 183.2 A4.8 4.8 0 0 0 234.1 176', 'M157.3 223.5 Q200 261.9 242.7 223.5'] },
      { say: 'Your sun is ready. Now color it in!', d: [] }
  ] },
  { id: 'star', name: 'Star', group: 'Things', level: 1, steps: [
      { say: 'Draw a pointy tent shape for the top point.', d: ['M154.2 154.5 L200 32.6 L245.8 154.5'] },
      { say: 'Add a point on the left and a point on the right.', d: ['M154.2 154.5 L24 160.4 L125.8 241.8', 'M245.8 154.5 L376 160.4 L274.2 241.8'] },
      { say: 'Draw two legs at the bottom to close the star.', d: ['M274.2 241.8 L308.8 367.4 L200 295.7 L91.2 367.4 L125.8 241.8'] },
      { say: 'Add two dots for eyes and a little smile.', d: ['M178 198.1 A4.5 4.5 0 0 0 174.1 204.9 A4.5 4.5 0 0 0 181.9 204.9 A4.5 4.5 0 0 0 178 198.1', 'M222 198.1 A4.5 4.5 0 0 0 218.1 204.9 A4.5 4.5 0 0 0 225.9 204.9 A4.5 4.5 0 0 0 222 198.1', 'M180 232.7 Q200 252.7 220 232.7'] },
      { say: 'Your star is ready. Now color it in!', d: [] }
  ] },
  { id: 'apple', name: 'Apple', group: 'Food', level: 1, steps: [
      { say: 'Draw a big round shape with a little dip on top.', d: ['M200 102.7 C155 69 42.6 69 37 181.4 C31.3 305.1 121.3 395.1 200 372.6 C278.7 395.1 368.7 305.1 363 181.4 C357.4 69 245 69 200 102.7'] },
      { say: 'Draw a short line up from the dip for the stem.', d: ['M200 102.7 Q195.5 57.7 215.7 24'] },
      { say: 'Add a leaf next to the stem.', d: ['M206.7 60 Q245 12.8 301.2 33 Q263 82.5 206.7 60'] },
      { say: 'Draw a small curve on the left for a shiny spot.', d: ['M81.9 203.9 Q81.9 147.7 115.7 123'] },
      { say: 'Your apple is ready. Now color it in!', d: [] }
  ] },
  { id: 'rainbow', name: 'Rainbow', group: 'Nature', level: 1, steps: [
      { say: 'Draw a fluffy cloud on each side.', d: ['M45.3 294.7 A32.7 32.7 0 0 1 25.5 254 A32.7 32.7 0 0 1 65.2 232.3 A40.9 40.9 0 0 1 143 241 A28.7 28.7 0 0 1 161.7 294.7 L45.3 294.7', 'M354.7 294.7 A32.7 32.7 0 0 0 374.5 254 A32.7 32.7 0 0 0 334.8 232.3 A40.9 40.9 0 0 0 257 241 A28.7 28.7 0 0 0 238.3 294.7 L354.7 294.7'] },
      { say: 'Draw a big arch from one cloud to the other.', d: ['M34.7 239.7 A168.8 168.8 0 0 1 365.3 239.7'] },
      { say: 'Draw a smaller arch inside the big one.', d: ['M81.6 213.6 A133 133 0 0 1 318.4 213.6'] },
      { say: 'Draw one more arch inside, even smaller.', d: ['M124 213.6 A97.2 97.2 0 0 1 276 213.6'] },
      { say: 'Your rainbow is ready. Now color it in!', d: [] }
  ] },
  { id: 'raincloud', name: 'Rain cloud', group: 'Nature', level: 1, steps: [
      { say: 'Draw a big fluffy cloud with bumps on top.', d: ['M59.3 223.1 A60.5 60.5 0 0 1 84.7 107.6 A77 77 0 0 1 213.8 56.6 A71.5 71.5 0 0 1 321 118.6 A55 55 0 0 1 345 223.1 L59.3 223.1'] },
      { say: 'Add two dots for eyes and a little smile.', d: ['M167 155.4 A5 5 0 0 0 162.7 162.9 A5 5 0 0 0 171.3 162.9 A5 5 0 0 0 167 155.4', 'M233 155.4 A5 5 0 0 0 228.7 162.9 A5 5 0 0 0 237.3 162.9 A5 5 0 0 0 233 155.4', 'M178 184.6 Q200 204.4 222 184.6'] },
      { say: 'Draw little raindrops under the cloud.', d: ['M90 250.6 C107.6 274.8 106.5 292.4 90 292.4 C73.5 292.4 72.4 274.8 90 250.6', 'M162.6 250.6 C180.2 274.8 179.1 292.4 162.6 292.4 C146.1 292.4 145 274.8 162.6 250.6', 'M235.2 250.6 C252.8 274.8 251.7 292.4 235.2 292.4 C218.7 292.4 217.6 274.8 235.2 250.6', 'M307.8 250.6 C325.4 274.8 324.3 292.4 307.8 292.4 C291.3 292.4 290.2 274.8 307.8 250.6'] },
      { say: 'Add more raindrops below them.', d: ['M126.3 322.1 C143.9 346.3 142.8 363.9 126.3 363.9 C109.8 363.9 108.7 346.3 126.3 322.1', 'M198.9 322.1 C216.5 346.3 215.4 363.9 198.9 363.9 C182.4 363.9 181.3 346.3 198.9 322.1', 'M271.5 322.1 C289.1 346.3 288 363.9 271.5 363.9 C255 363.9 253.9 346.3 271.5 322.1'] },
      { say: 'Your rain cloud is ready. Now color it in!', d: [] }
  ] },
  { id: 'mountain', name: 'Mountains', group: 'Nature', level: 1, steps: [
      { say: 'Draw a big pointy shape for the mountain.', d: ['M43 324.6 L195.2 77.3 L347.5 324.6'] },
      { say: 'Draw a smaller mountain behind it on the right.', d: ['M270.4 199.3 L290.4 158.1 L371.2 324.6'] },
      { say: 'Draw a zigzag line near the top for snow.', d: ['M136.3 172.4 L157.2 191.4 L176.2 172.4 L195.2 193.3 L214.3 172.4 L233.3 191.4 L254.2 172.4'] },
      { say: 'Draw a long line across the bottom for the ground.', d: ['M24 324.6 L376 324.6'] },
      { say: 'Add a round sun in the sky.', d: ['M85.8 75.4 A30.4 30.4 0 0 0 59.5 121 A30.4 30.4 0 0 0 112.2 121 A30.4 30.4 0 0 0 85.8 75.4'] },
      { say: 'Your mountains are ready. Now color it in!', d: [] }
  ] },
  { id: 'fish', name: 'Fish', group: 'Animals', level: 1, steps: [
      { say: 'Draw a big oval for the body.', d: ['M159.4 137.2 A135.4 97.5 0 0 0 42.1 283.4 A135.4 97.5 0 0 0 276.6 283.4 A135.4 97.5 0 0 0 159.4 137.2'] },
      { say: 'Add a triangle on the right for the tail.', d: ['M294.8 234.7 L376 164.3 Q354.3 234.7 376 305.1 L294.8 234.7'] },
      { say: 'Draw a round eye and a small smile.', d: ['M83.6 198.9 A14.1 14.1 0 0 0 71.4 220 A14.1 14.1 0 0 0 95.8 220 A14.1 14.1 0 0 0 83.6 198.9', 'M34.8 261.7 Q51.1 272.6 67.3 261.7'] },
      { say: 'Draw a curved line behind the eye.', d: ['M159.4 138.3 Q124.7 234.7 159.4 331.1'] },
      { say: 'Add three little bubbles above the fish.', d: ['M42.4 130.7 A11.9 11.9 0 0 0 32.1 148.6 A11.9 11.9 0 0 0 52.7 148.6 A11.9 11.9 0 0 0 42.4 130.7', 'M61.9 96 A8.7 8.7 0 0 0 54.4 109 A8.7 8.7 0 0 0 69.4 109 A8.7 8.7 0 0 0 61.9 96', 'M46.7 67.9 A6.5 6.5 0 0 0 41.1 77.6 A6.5 6.5 0 0 0 52.4 77.6 A6.5 6.5 0 0 0 46.7 67.9'] },
      { say: 'Your fish is ready. Now color it in!', d: [] }
  ] },
  { id: 'tree', name: 'Tree', group: 'Nature', level: 1, steps: [
      { say: 'Draw a big bumpy circle for the leaves.', d: ['M162.6 47.1 A41.8 41.8 0 0 1 237.4 47.1 A41.8 41.8 0 0 1 290.2 100 A41.8 41.8 0 0 1 290.2 174.7 A41.8 41.8 0 0 1 237.4 227.6 A41.8 41.8 0 0 1 162.6 227.6 A41.8 41.8 0 0 1 109.8 174.7 A41.8 41.8 0 0 1 109.8 100 A41.8 41.8 0 0 1 162.6 47.1'] },
      { say: 'Draw two lines down for the trunk.', d: ['M178.4 244.7 L170.2 376', 'M221.6 244.7 L229.8 376'] },
      { say: 'Draw a line across the bottom for the ground.', d: ['M80.7 376 L319.3 376'] },
      { say: 'Add three small circles for apples.', d: ['M160.2 108.5 A13.9 13.9 0 0 0 148.2 129.4 A13.9 13.9 0 0 0 172.3 129.4 A13.9 13.9 0 0 0 160.2 108.5', 'M239.8 93.6 A13.9 13.9 0 0 0 227.7 114.5 A13.9 13.9 0 0 0 251.8 114.5 A13.9 13.9 0 0 0 239.8 93.6', 'M209.9 163.2 A13.9 13.9 0 0 0 197.9 184.1 A13.9 13.9 0 0 0 222 184.1 A13.9 13.9 0 0 0 209.9 163.2'] },
      { say: 'Your tree is ready. Now color it in!', d: [] }
  ] },
  { id: 'flower', name: 'Flower', group: 'Nature', level: 1, steps: [
      { say: 'Draw a small circle for the middle.', d: ['M200 114.7 A34.5 34.5 0 0 0 170.1 166.4 A34.5 34.5 0 0 0 229.9 166.4 A34.5 34.5 0 0 0 200 114.7'] },
      { say: 'Draw five round petals around the circle.', d: ['M236.3 69.4 A45.4 36.3 -90 0 0 181.9 30.1 A45.4 36.3 -90 0 0 181.9 108.6 A45.4 36.3 -90 0 0 236.3 69.4', 'M238.4 148.5 A45.4 36.3 -18 0 0 315.5 137.2 A45.4 36.3 -18 0 0 273.9 87.9 A45.4 36.3 -18 0 0 238.4 148.5', 'M255 175 A45.4 36.3 54 0 0 209.3 218.3 A45.4 36.3 54 0 0 276.5 248.1 A45.4 36.3 54 0 0 255 175', 'M161.2 252.6 A45.4 36.3 126 0 0 182.7 179.5 A45.4 36.3 126 0 0 115.4 209.2 A45.4 36.3 126 0 0 161.2 252.6', 'M86.5 100.5 A45.4 36.3 198 0 0 122.1 161.2 A45.4 36.3 198 0 0 163.6 111.8 A45.4 36.3 198 0 0 86.5 100.5'] },
      { say: 'Draw a long line down for the stem.', d: ['M200 183.7 L200 376'] },
      { say: 'Add a leaf on each side of the stem.', d: ['M200 330.6 Q240.8 283.5 290.7 298.9 Q249.9 341.5 200 330.6', 'M200 305.2 Q159.2 258.1 109.3 273.5 Q150.1 316.1 200 305.2'] },
      { say: 'Your flower is ready. Now color it in!', d: [] }
  ] },
  { id: 'mushroom', name: 'Mushroom', group: 'Nature', level: 1, steps: [
      { say: 'Draw a big round cap like an umbrella.', d: ['M24 184.9 C24 -2.1 376 -2.1 376 184.9 C310 217.9 90 217.9 24 184.9'] },
      { say: 'Draw a short fat stem under the cap.', d: ['M132 207 C121.8 290.4 113.3 339.9 134 355.4 L266 355.4 C286.7 339.9 278.2 290.4 268 207'] },
      { say: 'Add some round spots on the cap.', d: ['M106.5 105.7 A24.2 24.2 0 0 0 85.5 142 A24.2 24.2 0 0 0 127.5 142 A24.2 24.2 0 0 0 106.5 105.7', 'M205.5 65 A26.4 26.4 0 0 0 182.6 104.6 A26.4 26.4 0 0 0 228.4 104.6 A26.4 26.4 0 0 0 205.5 65', 'M299 107.9 A22 22 0 0 0 279.9 140.9 A22 22 0 0 0 318.1 140.9 A22 22 0 0 0 299 107.9', 'M183.5 147.5 A15.4 15.4 0 0 0 170.2 170.6 A15.4 15.4 0 0 0 196.8 170.6 A15.4 15.4 0 0 0 183.5 147.5'] },
      { say: 'Draw two dots for eyes and a smile on the stem.', d: ['M172.5 256.9 A5 5 0 0 0 168.2 264.4 A5 5 0 0 0 176.8 264.4 A5 5 0 0 0 172.5 256.9', 'M227.5 256.9 A5 5 0 0 0 223.2 264.4 A5 5 0 0 0 231.8 264.4 A5 5 0 0 0 227.5 256.9', 'M178 292.7 Q200 312.5 222 292.7'] },
      { say: 'Your mushroom is ready. Now color it in!', d: [] }
  ] },
  { id: 'ladybug', name: 'Ladybug', group: 'Animals', level: 1, steps: [
      { say: 'Draw a big circle for the body.', d: ['M200 98.4 A138.8 138.8 0 0 0 79.8 306.6 A138.8 138.8 0 0 0 320.2 306.6 A138.8 138.8 0 0 0 200 98.4'] },
      { say: 'Add a half circle on top for the head.', d: ['M257.4 111.1 A57.5 57.5 0 0 0 200 50.8 A57.5 57.5 0 0 0 142.6 111.1'] },
      { say: 'Draw a line down the middle of the back.', d: ['M200 98.4 L200 376'] },
      { say: 'Add round spots on each side.', d: ['M140.5 158.9 A23.8 23.8 0 0 0 119.9 194.5 A23.8 23.8 0 0 0 161.1 194.5 A23.8 23.8 0 0 0 140.5 158.9', 'M259.5 158.9 A23.8 23.8 0 0 0 238.9 194.5 A23.8 23.8 0 0 0 280.1 194.5 A23.8 23.8 0 0 0 259.5 158.9', 'M135.5 261 A25.8 25.8 0 0 0 113.2 299.7 A25.8 25.8 0 0 0 157.9 299.7 A25.8 25.8 0 0 0 135.5 261', 'M264.5 261 A25.8 25.8 0 0 0 242.1 299.7 A25.8 25.8 0 0 0 286.8 299.7 A25.8 25.8 0 0 0 264.5 261'] },
      { say: 'Draw two antennas and two dots for eyes.', d: ['M180.2 55.7 Q172.2 26 145.5 24', 'M219.8 55.7 Q227.8 26 254.5 24', 'M180.2 74.1 A4.5 4.5 0 0 0 176.3 80.8 A4.5 4.5 0 0 0 184 80.8 A4.5 4.5 0 0 0 180.2 74.1', 'M219.8 74.1 A4.5 4.5 0 0 0 216 80.8 A4.5 4.5 0 0 0 223.7 80.8 A4.5 4.5 0 0 0 219.8 74.1'] },
      { say: 'Your ladybug is ready. Now color it in!', d: [] }
  ] },
  { id: 'snail', name: 'Snail', group: 'Animals', level: 1, steps: [
      { say: 'Draw a big circle for the shell.', d: ['M185.2 73.7 A107.5 107.5 0 0 0 92.1 234.9 A107.5 107.5 0 0 0 278.3 234.9 A107.5 107.5 0 0 0 185.2 73.7'] },
      { say: 'Draw a swirl inside the shell.', d: ['M193.3 181.2 A16.1 16.1 0 0 0 177.2 165.1 A16.1 16.1 0 0 0 161 181.2 A32.2 32.2 0 0 0 193.3 213.4 A32.2 32.2 0 0 0 225.5 181.2 A48.4 48.4 0 0 0 177.2 132.8 A48.4 48.4 0 0 0 128.8 181.2 A64.5 64.5 0 0 0 193.3 245.7 A64.5 64.5 0 0 0 257.8 181.2 A80.6 80.6 0 0 0 177.2 100.6 A80.6 80.6 0 0 0 96.5 181.2'] },
      { say: 'Draw a long body under the shell with a round head.', d: ['M105.8 253.3 C67.6 264.7 38.9 301.4 24 326.3 L308.8 326.3 C357.2 326.3 375.5 299.4 375.5 245.7 C375.5 208.1 364.7 168.3 335.7 168.3 C303.5 168.3 295.9 202.7 298.1 234.9 C293.9 237 285.7 238.7 274.8 240.1'] },
      { say: 'Add two antennas with dots on the head.', d: ['M328.2 186.6 L308.8 116.7', 'M349.7 186.6 L369 118.9', 'M306.7 103.3 A4.8 4.8 0 0 0 302.5 110.5 A4.8 4.8 0 0 0 310.9 110.5 A4.8 4.8 0 0 0 306.7 103.3', 'M371.2 105.4 A4.8 4.8 0 0 0 367 112.7 A4.8 4.8 0 0 0 375.4 112.7 A4.8 4.8 0 0 0 371.2 105.4'] },
      { say: 'Draw a little smile on the face.', d: ['M345.4 224.2 Q359.3 236 371.2 222'] },
      { say: 'Your snail is ready. Now color it in!', d: [] }
  ] },
  { id: 'icecream', name: 'Ice cream cone', group: 'Food', level: 1, steps: [
      { say: 'Draw a big round scoop with a wavy bottom.', d: ['M101.4 211.7 C78 42.8 322 42.8 298.6 211.7 Q278.8 239.9 259.1 211.7 Q239.4 239.9 219.7 211.7 Q200 239.9 180.3 211.7 Q160.6 239.9 140.9 211.7 Q121.2 239.9 101.4 211.7'] },
      { say: 'Draw a long V shape under it for the cone.', d: ['M123 225.8 L200 376 L277 225.8'] },
      { say: 'Draw criss-cross lines on the cone.', d: ['M136.4 251.9 L162.5 225.8', 'M165 307.7 L246.9 225.8', 'M263.6 251.9 L237.5 225.8', 'M235 307.7 L153.1 225.8'] },
      { say: 'Add a round cherry on top with a little stem.', d: ['M200 47.5 A18.8 18.8 0 0 0 183.7 75.6 A18.8 18.8 0 0 0 216.3 75.6 A18.8 18.8 0 0 0 200 47.5', 'M200 47.5 Q202.8 28.7 220.7 24'] },
      { say: 'Your ice cream is ready. Now color it in!', d: [] }
  ] },
  { id: 'duck', name: 'Duck', group: 'Animals', level: 1, steps: [
      { say: 'Draw a big round body with a pointy tail.', d: ['M111.8 188.6 C88.7 202.6 73.4 221.5 73.4 243.5 C73.4 290.8 134.9 323.9 210.5 323.9 C286.2 323.9 338.2 295.5 347.6 253 L376 191.5 L324 198.1 C295.6 172.6 257.8 163.1 210.5 163.1 C202.1 163.1 193.6 163.7 185.2 164.7'] },
      { say: 'Add a circle on top for the head.', d: ['M134.9 76.1 A58.6 58.6 0 0 0 84.1 164.1 A58.6 58.6 0 0 0 185.6 164.1 A58.6 58.6 0 0 0 134.9 76.1'] },
      { say: 'Draw a flat beak on the left side.', d: ['M78.1 118.7 C45 109.2 21.4 125.3 24.2 137.6 C27.1 152.7 54.5 160.3 79.1 153.7'] },
      { say: 'Add a dot for the eye and a curved wing.', d: ['M146.2 116.3 A4.3 4.3 0 0 0 142.5 122.7 A4.3 4.3 0 0 0 149.9 122.7 A4.3 4.3 0 0 0 146.2 116.3', 'M182.1 232.2 C220 215.1 286.2 217 307 235.9 C276.7 273.8 212.4 273.8 182.1 232.2'] },
      { say: 'Your duck is ready. Now color it in!', d: [] }
  ] },
  { id: 'snowman', name: 'Snowman', group: 'Things', level: 2, steps: [
      { say: 'Draw a big circle for the bottom.', d: ['M200 203.6 A86.2 86.2 0 0 0 125.3 332.9 A86.2 86.2 0 0 0 274.7 332.9 A86.2 86.2 0 0 0 200 203.6'] },
      { say: 'Draw a smaller circle on top for the head.', d: ['M200 81.8 A60.9 60.9 0 0 0 147.3 173.1 A60.9 60.9 0 0 0 252.7 173.1 A60.9 60.9 0 0 0 200 81.8'] },
      { say: 'Add two dots for eyes and a carrot nose.', d: ['M179.7 120.9 A4.6 4.6 0 0 0 175.8 127.7 A4.6 4.6 0 0 0 183.7 127.7 A4.6 4.6 0 0 0 179.7 120.9', 'M220.3 120.9 A4.6 4.6 0 0 0 216.3 127.7 A4.6 4.6 0 0 0 224.2 127.7 A4.6 4.6 0 0 0 220.3 120.9', 'M200 140.7 L250.7 151.8 L200 160.9 L200 140.7'] },
      { say: 'Draw a little smile under the nose.', d: ['M175.7 170.1 Q200 186.3 224.3 170.1'] },
      { say: 'Draw a tall hat on top of the head.', d: ['M144.2 81.8 L255.8 81.8', 'M164.5 81.8 L169.6 24 L230.4 24 L235.5 81.8'] },
      { say: 'Add three round buttons down the middle.', d: ['M200 239.6 A4.6 4.6 0 0 0 196 246.4 A4.6 4.6 0 0 0 204 246.4 A4.6 4.6 0 0 0 200 239.6', 'M200 280.1 A4.6 4.6 0 0 0 196 287 A4.6 4.6 0 0 0 204 287 A4.6 4.6 0 0 0 200 280.1', 'M200 320.7 A4.6 4.6 0 0 0 196 327.6 A4.6 4.6 0 0 0 204 327.6 A4.6 4.6 0 0 0 200 320.7'] },
      { say: 'Draw two stick arms on the sides.', d: ['M125.9 246.2 L56 198.5', 'M78.3 213.7 L68.1 186.3', 'M274.1 246.2 L344 198.5', 'M321.7 213.7 L331.9 186.3'] },
      { say: 'Your snowman is ready. Now color it in!', d: [] }
  ] },
  { id: 'house', name: 'House', group: 'Things', level: 2, steps: [
      { say: 'Draw a big triangle for the roof.', d: ['M32.7 185.6 L200 24 L367.3 185.6 L32.7 185.6'] },
      { say: 'Draw a box under the roof for the walls.', d: ['M67.3 185.6 L67.3 376 L332.7 376 L332.7 185.6'] },
      { say: 'Draw a tall door in the middle.', d: ['M167.7 376 L167.7 277.9 L232.3 277.9 L232.3 376'] },
      { say: 'Add a small dot for the door handle.', d: ['M218.5 324.1 A5.8 5.8 0 0 0 213.5 332.7 A5.8 5.8 0 0 0 223.5 332.7 A5.8 5.8 0 0 0 218.5 324.1'] },
      { say: 'Draw a square window on each side.', d: ['M90.4 214.4 L142.3 214.4 L142.3 266.4 L90.4 266.4 L90.4 214.4', 'M257.7 214.4 L309.6 214.4 L309.6 266.4 L257.7 266.4 L257.7 214.4'] },
      { say: 'Draw a cross in each window.', d: ['M116.3 214.4 L116.3 266.4', 'M90.4 240.4 L142.3 240.4', 'M283.7 214.4 L283.7 266.4', 'M257.7 240.4 L309.6 240.4'] },
      { say: 'Add a chimney on the roof.', d: ['M271.6 93.1 L271.6 47.1 L313.1 47.1 L313.1 133.2'] },
      { say: 'Your house is ready. Now color it in!', d: [] }
  ] },
  { id: 'boat', name: 'Sailboat', group: 'Vehicles', level: 2, steps: [
      { say: 'Draw a boat shape like a wide bowl.', d: ['M53.3 267.2 L346.7 267.2 L297.8 335.7 L102.2 335.7 L53.3 267.2'] },
      { say: 'Draw a tall line up from the boat for the mast.', d: ['M200 267.2 L200 37.4'] },
      { say: 'Add a big triangle sail on the right.', d: ['M200 61.9 L332 247.7 L200 247.7'] },
      { say: 'Add a smaller triangle sail on the left.', d: ['M200 101 L90.5 247.7 L200 247.7'] },
      { say: 'Draw a little flag at the top.', d: ['M200 37.4 L239.1 49.2 L200 60.9'] },
      { say: 'Add three round windows on the boat.', d: ['M131.6 288.7 A12.7 12.7 0 0 0 120.5 307.8 A12.7 12.7 0 0 0 142.6 307.8 A12.7 12.7 0 0 0 131.6 288.7', 'M200 288.7 A12.7 12.7 0 0 0 189 307.8 A12.7 12.7 0 0 0 211 307.8 A12.7 12.7 0 0 0 200 288.7', 'M268.4 288.7 A12.7 12.7 0 0 0 257.4 307.8 A12.7 12.7 0 0 0 279.5 307.8 A12.7 12.7 0 0 0 268.4 288.7'] },
      { say: 'Draw a wavy line under the boat for water.', d: ['M24 355.2 Q46 340.6 68 355.2 Q90 369.9 112 355.2 Q134 340.6 156 355.2 Q178 369.9 200 355.2 Q222 340.6 244 355.2 Q266 369.9 288 355.2 Q310 340.6 332 355.2 Q354 369.9 376 355.2'] },
      { say: 'Your sailboat is ready. Now color it in!', d: [] }
  ] },
  { id: 'car', name: 'Car', group: 'Vehicles', level: 2, steps: [
      { say: 'Draw two big circles for the wheels.', d: ['M106.1 220.5 A46.9 46.9 0 0 0 65.5 290.9 A46.9 46.9 0 0 0 146.8 290.9 A46.9 46.9 0 0 0 106.1 220.5', 'M293.9 220.5 A46.9 46.9 0 0 0 253.2 290.9 A46.9 46.9 0 0 0 334.5 290.9 A46.9 46.9 0 0 0 293.9 220.5'] },
      { say: 'Draw a long box with round corners on top of the wheels.', d: ['M247.3 261.6 L152.7 261.6', 'M59.6 261.6 L24 261.6 L24 208.8 Q24 173.6 65.1 170.1 L334.9 170.1 Q376 173.6 376 208.8 L376 261.6 L340.4 261.6'] },
      { say: 'Draw a shape on top for the roof.', d: ['M94.4 170.1 L141.3 85.6 L270.4 85.6 L317.3 170.1'] },
      { say: 'Add two windows inside the roof.', d: ['M114.3 160.7 L150.7 97.3 L197.7 97.3 L197.7 160.7 L114.3 160.7', 'M214.1 160.7 L214.1 97.3 L261 97.3 L296.2 160.7 L214.1 160.7'] },
      { say: 'Add a small circle inside each wheel.', d: ['M106.1 251 A16.4 16.4 0 0 0 91.9 275.7 A16.4 16.4 0 0 0 120.4 275.7 A16.4 16.4 0 0 0 106.1 251', 'M293.9 251 A16.4 16.4 0 0 0 279.6 275.7 A16.4 16.4 0 0 0 308.1 275.7 A16.4 16.4 0 0 0 293.9 251'] },
      { say: 'Draw a line for the door and a little handle.', d: ['M205.9 170.1 L205.9 261.6', 'M221.1 197.1 L244.6 197.1'] },
      { say: 'Add a round light at the front.', d: ['M356.1 195.3 A5.3 5.3 0 0 0 351.5 203.2 A5.3 5.3 0 0 0 360.6 203.2 A5.3 5.3 0 0 0 356.1 195.3'] },
      { say: 'Your car is ready. Now color it in!', d: [] }
  ] },
  { id: 'rocket', name: 'Rocket', group: 'Vehicles', level: 2, steps: [
      { say: 'Draw a tall shape with a pointy top for the rocket.', d: ['M157.3 290.5 L157.3 129.6 Q162.3 64.2 202.5 24 Q242.7 64.2 247.8 129.6 L247.8 290.5 L157.3 290.5'] },
      { say: 'Draw a round window near the top.', d: ['M202.5 103.5 A26.1 26.1 0 0 0 179.9 142.7 A26.1 26.1 0 0 0 225.2 142.7 A26.1 26.1 0 0 0 202.5 103.5'] },
      { say: 'Add a fin on each side at the bottom.', d: ['M157.3 215.1 L112 270.4 L112 312.6 L157.3 290.5', 'M247.8 215.1 L293 270.4 L293 312.6 L247.8 290.5'] },
      { say: 'Draw a small shape under the rocket for the engine.', d: ['M174.4 290.5 L167.3 312.6 L237.7 312.6 L230.7 290.5'] },
      { say: 'Draw a wavy flame coming out of the bottom.', d: ['M177.4 312.6 C170.3 340.8 187.4 340.8 184.4 352.9 C194.5 342.8 202.5 376 202.5 376 C202.5 376 210.6 342.8 220.6 352.9 C217.6 340.8 234.7 340.8 227.7 312.6'] },
      { say: 'Draw a line across the rocket near the bottom.', d: ['M157.3 245.3 L247.8 245.3'] },
      { say: 'Add two twinkly stars in the sky.', d: ['M81.8 59.2 L81.8 99.4', 'M61.7 79.3 L101.9 79.3', 'M323.2 104.5 L323.2 134.6', 'M308.1 119.5 L338.3 119.5'] },
      { say: 'Your rocket is ready. Now color it in!', d: [] }
  ] },
  { id: 'cupcake', name: 'Cupcake', group: 'Food', level: 2, steps: [
      { say: 'Draw a big bumpy shape for the frosting.', d: ['M71.5 248.9 A39.1 39.1 0 0 1 97.6 180.4 A48.9 48.9 0 0 1 149.9 126.8 A53.8 53.8 0 0 1 250.1 126.8 A48.9 48.9 0 0 1 302.4 180.4 A39.1 39.1 0 0 1 328.5 248.9 Q302.8 271.4 277.1 248.9 Q251.4 271.4 225.7 248.9 Q200 271.4 174.3 248.9 Q148.6 271.4 122.9 248.9 Q97.2 271.4 71.5 248.9'] },
      { say: 'Draw a cup shape under it with a flat bottom.', d: ['M90.8 259.4 L126.7 376 L273.3 376 L309.2 259.4'] },
      { say: 'Add three lines down the cup.', d: ['M152.2 259.9 L163.8 376', 'M200 260.1 L200 376', 'M247.8 259.9 L236.2 376'] },
      { say: 'Draw a round cherry on top.', d: ['M200 48.4 A21.5 21.5 0 0 0 181.4 80.7 A21.5 21.5 0 0 0 218.6 80.7 A21.5 21.5 0 0 0 200 48.4'] },
      { say: 'Add a little stem on the cherry.', d: ['M200 48.4 Q203.9 28.9 224.4 24'] },
      { say: 'Draw tiny lines on the frosting for sprinkles.', d: ['M116.9 209.8 L129.6 200', 'M160.9 165.8 L170.7 177.5', 'M195.1 121.8 L207.8 114.9', 'M231.3 154 L237.2 167.7', 'M270.4 197.1 L283.1 189.2', 'M295.8 226.4 L306.6 236.2', 'M165.8 219.6 L177.5 226.4', 'M224.4 209.8 L237.2 202.9', 'M102.2 234.2 L112 242'] },
      { say: 'Your cupcake is ready. Now color it in!', d: [] }
  ] },
  { id: 'person', name: 'Smiling child', group: 'People', level: 2, steps: [
      { say: 'Draw a circle for the head.', d: ['M199 44.5 A63 63 0 0 0 144.4 139.1 A63 63 0 0 0 253.6 139.1 A63 63 0 0 0 199 44.5'] },
      { say: 'Draw a round shape on top for the hair.', d: ['M135.9 112.6 C115.6 56.7 148.1 21.1 199 24.2 C249.8 21.1 282.4 56.7 262 112.6'] },
      { say: 'Add two dots for eyes and a big smile.', d: ['M176.6 95.9 A4.6 4.6 0 0 0 172.6 102.7 A4.6 4.6 0 0 0 180.6 102.7 A4.6 4.6 0 0 0 176.6 95.9', 'M221.4 95.9 A4.6 4.6 0 0 0 217.4 102.7 A4.6 4.6 0 0 0 225.3 102.7 A4.6 4.6 0 0 0 221.4 95.9', 'M173.6 127.9 Q199 150.3 224.4 127.9'] },
      { say: 'Draw a shape like a bell under the head for the shirt.', d: ['M170.3 163.6 C148 173.8 129.8 204.4 129.8 290.6 L268.1 290.6 C268.1 204.4 249.9 173.8 227.6 163.6'] },
      { say: 'Draw two arms with round hands, one waving up.', d: ['M145 190.9 L84.4 147.4', 'M72.9 124.8 A14.2 14.2 0 0 0 60.6 146.2 A14.2 14.2 0 0 0 85.2 146.2 A14.2 14.2 0 0 0 72.9 124.8', 'M262.7 222.1 L315.1 255.5', 'M327.1 248.9 A14.2 14.2 0 0 0 314.8 270.2 A14.2 14.2 0 0 0 339.4 270.2 A14.2 14.2 0 0 0 327.1 248.9'] },
      { say: 'Draw two legs with little shoes.', d: ['M173.6 290.6 L173.6 354.3', 'M224.4 290.6 L224.4 354.3', 'M158.3 351.6 A24.4 12.2 0 0 0 137.2 369.9 A24.4 12.2 0 0 0 179.4 369.9 A24.4 12.2 0 0 0 158.3 351.6', 'M239.7 351.6 A24.4 12.2 0 0 0 218.5 369.9 A24.4 12.2 0 0 0 260.8 369.9 A24.4 12.2 0 0 0 239.7 351.6'] },
      { say: 'Your friend is ready. Now color it in!', d: [] }
  ] },
  { id: 'cat', name: 'Cat', group: 'Animals', level: 2, steps: [
      { say: 'Draw a big circle for the head.', d: ['M173.1 46.9 A79.8 79.8 0 0 0 104 166.6 A79.8 79.8 0 0 0 242.2 166.6 A79.8 79.8 0 0 0 173.1 46.9'] },
      { say: 'Add two pointy triangle ears on top.', d: ['M107.3 82 L103.3 24 L154 49.3', 'M238.9 82 L242.9 24 L192.2 49.3'] },
      { say: 'Draw two ovals for eyes and a small triangle nose.', d: ['M141.2 100.8 A8 13 0 0 0 134.3 120.2 A8 13 0 0 0 148.1 120.2 A8 13 0 0 0 141.2 100.8', 'M205 100.8 A8 13 0 0 0 198.1 120.2 A8 13 0 0 0 211.9 120.2 A8 13 0 0 0 205 100.8', 'M162.1 141.7 L184.1 141.7 L173.1 153.6 L162.1 141.7'] },
      { say: 'Add a little mouth and two whiskers on each side.', d: ['M151.2 163.6 Q163.1 173.6 173.1 153.6 Q183.1 173.6 195 163.6', 'M125.2 146.7 L68.4 136.7', 'M125.2 157.6 L68.4 163.6', 'M221 146.7 L277.8 136.7', 'M221 157.6 L277.8 163.6'] },
      { say: 'Draw a big oval under the head for the body.', d: ['M173.1 206.5 A99.7 84.8 0 0 0 86.7 333.6 A99.7 84.8 0 0 0 259.4 333.6 A99.7 84.8 0 0 0 173.1 206.5'] },
      { say: 'Draw two short lines on the body for the front legs.', d: ['M148.2 301.2 L148.2 373.3', 'M198 301.2 L198 373.3'] },
      { say: 'Add a long curvy tail on the right.', d: ['M266.8 320.2 C317.7 321.2 347.6 271.3 322.7 226.4'] },
      { say: 'Your cat is ready. Now color it in!', d: [] }
  ] },
  { id: 'bunny', name: 'Bunny', group: 'Animals', level: 2, steps: [
      { say: 'Draw a circle for the head.', d: ['M200 99.4 A63.7 63.7 0 0 0 144.8 195.1 A63.7 63.7 0 0 0 255.2 195.1 A63.7 63.7 0 0 0 200 99.4'] },
      { say: 'Add two long ovals on top for ears.', d: ['M196.5 99.7 A23.5 56.9 -12 0 0 158.8 24.2 A23.5 56.9 -12 0 0 158.2 115.2', 'M203.5 99.7 A23.5 56.9 12 0 1 241.2 24.2 A23.5 56.9 12 0 1 241.8 115.2'] },
      { say: 'Draw a thin oval inside each ear.', d: ['M182.8 101.9 A9.8 39.2 -12 0 0 162.4 48.3 A9.8 39.2 -12 0 0 166.8 108.9', 'M217.2 101.9 A9.8 39.2 12 0 1 237.6 48.3 A9.8 39.2 12 0 1 233.2 108.9'] },
      { say: 'Add two dots for eyes and a tiny nose.', d: ['M176.5 149 A4.4 4.4 0 0 0 172.6 155.6 A4.4 4.4 0 0 0 180.3 155.6 A4.4 4.4 0 0 0 176.5 149', 'M223.5 149 A4.4 4.4 0 0 0 219.7 155.6 A4.4 4.4 0 0 0 227.4 155.6 A4.4 4.4 0 0 0 223.5 149', 'M192.2 175 L207.8 175 L200 183.8 L192.2 175'] },
      { say: 'Draw a little mouth and two whiskers on each side.', d: ['M184.3 194.6 Q192.2 200.5 200 183.8 Q207.8 200.5 215.7 194.6', 'M168.6 180.8 L129.4 173', 'M168.6 189.7 L129.4 194.6', 'M231.4 180.8 L270.6 173', 'M231.4 189.7 L270.6 194.6'] },
      { say: 'Draw two round feet at the bottom.', d: ['M158.8 346.6 A31.4 14.7 0 0 0 131.6 368.6 A31.4 14.7 0 0 0 186 368.6 A31.4 14.7 0 0 0 158.8 346.6', 'M241.2 346.6 A31.4 14.7 0 0 0 214 368.6 A31.4 14.7 0 0 0 268.4 368.6 A31.4 14.7 0 0 0 241.2 346.6'] },
      { say: 'Draw a big oval between the head and feet for the body.', d: ['M180.3 223.7 A93.2 73.6 0 0 0 137.9 350.4', 'M186.3 368.3 A93.2 73.6 0 0 0 213.7 368.3', 'M262.1 350.4 A93.2 73.6 0 0 0 219.7 223.7'] },
      { say: 'Your bunny is ready. Now color it in!', d: [] }
  ] },
  { id: 'bear', name: 'Bear', group: 'Animals', level: 2, steps: [
      { say: 'Draw a big circle for the head.', d: ['M200 39.4 A82.1 82.1 0 0 0 128.9 162.5 A82.1 82.1 0 0 0 271.1 162.5 A82.1 82.1 0 0 0 200 39.4'] },
      { say: 'Add two round ears with small circles inside.', d: ['M163.4 48.2 A30.8 30.8 0 0 0 133.3 24 A30.8 30.8 0 0 0 126.7 84.9', 'M273.3 84.9 A30.8 30.8 0 0 0 266.7 24 A30.8 30.8 0 0 0 236.6 48.2', 'M150.5 56.1 A14.4 14.4 0 0 0 136.4 44.5 A14.4 14.4 0 0 0 133.8 73', 'M266.2 73 A14.4 14.4 0 0 0 263.6 44.5 A14.4 14.4 0 0 0 249.5 56.1'] },
      { say: 'Draw an oval in the middle for the snout.', d: ['M200 126.6 A43.1 32.8 0 0 0 162.7 175.9 A43.1 32.8 0 0 0 237.3 175.9 A43.1 32.8 0 0 0 200 126.6'] },
      { say: 'Add two dots for eyes and a round nose.', d: ['M164.1 101.5 A4.6 4.6 0 0 0 160.1 108.4 A4.6 4.6 0 0 0 168.1 108.4 A4.6 4.6 0 0 0 164.1 101.5', 'M235.9 101.5 A4.6 4.6 0 0 0 231.9 108.4 A4.6 4.6 0 0 0 239.9 108.4 A4.6 4.6 0 0 0 235.9 101.5', 'M200 135.9 A14.4 9.2 0 0 0 187.6 149.7 A14.4 9.2 0 0 0 212.4 149.7 A14.4 9.2 0 0 0 200 135.9'] },
      { say: 'Draw a little mouth under the nose.', d: ['M200 154.3 L200 169.7 Q209.2 184.1 218.5 173.8', 'M200 169.7 Q190.8 184.1 181.5 173.8'] },
      { say: 'Draw two round feet at the bottom.', d: ['M148.7 339.1 A30.8 18.5 0 0 0 122 366.8 A30.8 18.5 0 0 0 175.4 366.8 A30.8 18.5 0 0 0 148.7 339.1', 'M251.3 339.1 A30.8 18.5 0 0 0 224.6 366.8 A30.8 18.5 0 0 0 278 366.8 A30.8 18.5 0 0 0 251.3 339.1'] },
      { say: 'Draw a big oval between the head and feet for the body.', d: ['M171.7 369.7 A102.6 82.1 0 0 0 228.3 369.7', 'M275.7 346.3 A102.6 82.1 0 0 0 200 208.7 A102.6 82.1 0 0 0 124.3 346.3'] },
      { say: 'Your bear is ready. Now color it in!', d: [] }
  ] },
  { id: 'dog', name: 'Dog', group: 'Animals', level: 2, steps: [
      { say: 'Draw a big oval for the head.', d: ['M187.6 24 A95 83.8 0 0 0 105.4 149.7 A95 83.8 0 0 0 269.9 149.7 A95 83.8 0 0 0 187.6 24'] },
      { say: 'Add two long floppy ears on the sides.', d: ['M109.8 60 A33.5 76 12 0 0 105.1 58.1 A33.5 76 12 0 0 53.5 170.4 A33.5 76 12 0 0 115.5 162.1', 'M265.4 60 A33.5 76 -12 0 1 270.2 58.1 A33.5 76 -12 0 1 321.8 170.4 A33.5 76 -12 0 1 259.7 162.1'] },
      { say: 'Draw two dots for eyes and a round nose.', d: ['M154.1 82.7 A5 5 0 0 0 149.7 90.2 A5 5 0 0 0 158.4 90.2 A5 5 0 0 0 154.1 82.7', 'M221.1 82.7 A5 5 0 0 0 216.8 90.2 A5 5 0 0 0 225.5 90.2 A5 5 0 0 0 221.1 82.7', 'M187.6 116.7 A20.1 13.4 0 0 0 170.2 136.9 A20.1 13.4 0 0 0 205 136.9 A20.1 13.4 0 0 0 187.6 116.7'] },
      { say: 'Draw a happy mouth under the nose.', d: ['M187.6 143.6 L187.6 154.7', 'M160.8 152.5 Q174.2 170.4 187.6 154.7 Q201 170.4 214.4 152.5'] },
      { say: 'Draw a big oval under the head for the body.', d: ['M187.6 197.2 A106.2 89.4 0 0 0 95.7 331.3 A106.2 89.4 0 0 0 279.6 331.3 A106.2 89.4 0 0 0 187.6 197.2'] },
      { say: 'Draw two short lines for the front legs.', d: ['M154.1 303.4 L154.1 371.2', 'M221.1 303.4 L221.1 371.2'] },
      { say: 'Add a wiggly tail on the right.', d: ['M293.7 286 C340.9 281.1 356.4 244.6 341.8 206.1'] },
      { say: 'Your dog is ready. Now color it in!', d: [] }
  ] },
  { id: 'pig', name: 'Pig', group: 'Animals', level: 2, steps: [
      { say: 'Draw a small oval with two dots for the snout.', d: ['M47.1 143.5 A23.1 30.8 0 0 0 27.1 189.6 A23.1 30.8 0 0 0 67.1 189.6 A23.1 30.8 0 0 0 47.1 143.5', 'M41.3 156.9 A2.9 5.8 0 0 0 38.8 165.6 A2.9 5.8 0 0 0 43.8 165.6 A2.9 5.8 0 0 0 41.3 156.9', 'M41.3 180 A2.9 5.8 0 0 0 38.8 188.7 A2.9 5.8 0 0 0 43.8 188.7 A2.9 5.8 0 0 0 41.3 180'] },
      { say: 'Draw a big circle behind it for the head.', d: ['M57.1 201.9 A67.3 67.3 0 0 0 170.3 189 A67.3 67.3 0 0 0 109.6 92.5 A67.3 67.3 0 0 0 44.2 143.7'] },
      { say: 'Add two round ears on top of the head.', d: ['M104 92.9 A19.2 30.8 -30 0 0 68.2 67.8 A19.2 30.8 -30 0 0 68.5 106.5', 'M154.5 109.8 A19.2 30.8 30 0 0 160.6 63.9 A19.2 30.8 30 0 0 123.4 94.1'] },
      { say: 'Draw a dot for the eye and a little smile.', d: ['M112.5 136.3 A4.3 4.3 0 0 0 108.7 142.8 A4.3 4.3 0 0 0 116.2 142.8 A4.3 4.3 0 0 0 112.5 136.3', 'M72.1 215.6 Q89.4 227.1 106.7 215.6'] },
      { say: 'Draw a big oval behind the head for the body.', d: ['M82.2 221.2 A134.6 91.4 0 0 0 317.3 267.6 A134.6 91.4 0 0 0 215.4 116.5 A134.6 91.4 0 0 0 165.8 123'] },
      { say: 'Draw four short legs under the body.', d: ['M124 274.8 L124 337.7 L152.9 337.7 L152.9 288.6', 'M172.1 294.2 L172.1 337.7 L201 337.7 L201 298.6', 'M253.9 295.3 L253.9 337.7 L282.7 337.7 L282.7 287', 'M301.9 277.7 L301.9 337.7 L330.8 337.7 L330.8 254.8'] },
      { say: 'Add a curly tail at the back.', d: ['M348.1 191.6 C378.9 183.9 381.8 148.3 360.6 150.2 C341.4 152.1 347.1 183.9 376 175.2'] },
      { say: 'Your pig is ready. Now color it in!', d: [] }
  ] },
  { id: 'mouse', name: 'Mouse', group: 'Animals', level: 2, steps: [
      { say: 'Draw a big teardrop shape for the body.', d: ['M44.2 218.4 C60.2 190.1 85.5 167 114.8 151', 'M196.7 126.6 C254.7 122.6 311 146.6 335.2 209.5 C350.5 260.7 314.7 281.2 263.5 281.2 L120.2 281.2 C82.9 281.2 58.3 264.2 42.7 237.9'] },
      { say: 'Add a big round ear on top.', d: ['M150.9 76.4 A46.1 46.1 0 0 0 111 145.5 A46.1 46.1 0 0 0 190.8 145.5 A46.1 46.1 0 0 0 150.9 76.4'] },
      { say: 'Draw a smaller circle inside the ear.', d: ['M150.9 97.9 A24.6 24.6 0 0 0 129.7 134.8 A24.6 24.6 0 0 0 172.2 134.8 A24.6 24.6 0 0 0 150.9 97.9'] },
      { say: 'Add a dot for the eye and a round nose.', d: ['M99.7 182.4 A4.6 4.6 0 0 0 95.8 189.3 A4.6 4.6 0 0 0 103.7 189.3 A4.6 4.6 0 0 0 99.7 182.4', 'M40.4 217.7 A10.2 10.2 0 0 0 31.5 233.1 A10.2 10.2 0 0 0 49.2 233.1 A10.2 10.2 0 0 0 40.4 217.7'] },
      { say: 'Draw whiskers near the nose.', d: ['M69 221.8 L26 205.4', 'M69 234.1 L24 244.3'] },
      { say: 'Draw a long curly tail at the back.', d: ['M333.1 245.3 C381.2 260.7 391.5 311.9 350.5 322.1 C314.7 330.3 304.5 301.6 330.1 293.4'] },
      { say: 'Add two small feet at the bottom.', d: ['M115.1 281.2 C115.1 303.7 161.2 303.7 161.2 281.2', 'M237.9 281.2 C237.9 303.7 284 303.7 284 281.2'] },
      { say: 'Your mouse is ready. Now color it in!', d: [] }
  ] },
  { id: 'bird', name: 'Bird', group: 'Animals', level: 2, steps: [
      { say: 'Draw a big round shape for the body.', d: ['M189.5 77.2 A120.3 105.3 0 0 0 85.3 235.1 A120.3 105.3 0 0 0 293.7 235.1 A120.3 105.3 0 0 0 189.5 77.2'] },
      { say: 'Add a small pointy beak on the left.', d: ['M73.4 154.7 L24 168.4 L69.2 181.6'] },
      { say: 'Draw a dot for the eye.', d: ['M119.3 142.8 A4.5 4.5 0 0 0 115.4 149.6 A4.5 4.5 0 0 0 123.2 149.6 A4.5 4.5 0 0 0 119.3 142.8'] },
      { say: 'Draw a round wing in the middle.', d: ['M159.4 192.5 C199.5 154.4 269.7 164.4 289.8 204.5 C249.6 234.6 189.5 232.6 159.4 192.5'] },
      { say: 'Add a pointy tail on the right.', d: ['M303.1 148.5 L372 100.2 Q357.9 152.4 376 187.5 L307.4 202.4'] },
      { say: 'Draw two little legs under the body.', d: ['M165.3 285.4 L159.4 320.8', 'M214.5 285.2 L214.5 320.8'] },
      { say: 'Draw a long branch under the feet.', d: ['M29 322.8 L370 322.8'] },
      { say: 'Your bird is ready. Now color it in!', d: [] }
  ] },
  { id: 'penguin', name: 'Penguin', group: 'Animals', level: 2, steps: [
      { say: 'Draw a tall oval for the body.', d: ['M200 24 A114.6 171.8 0 0 0 100.8 281.7 A114.6 171.8 0 0 0 299.2 281.7 A114.6 171.8 0 0 0 200 24'] },
      { say: 'Draw a shape inside for the white tummy and face.', d: ['M200 81.3 C170.8 48 116.7 66.7 121.9 133.3 C127.1 195.8 116.7 247.9 135.4 294.8 C156.3 333.3 243.7 333.3 264.6 294.8 C283.3 247.9 272.9 195.8 278.1 133.3 C283.3 66.7 229.2 48 200 81.3'] },
      { say: 'Add two dots for eyes.', d: ['M166.7 105.7 A4.7 4.7 0 0 0 162.6 112.8 A4.7 4.7 0 0 0 170.7 112.8 A4.7 4.7 0 0 0 166.7 105.7', 'M233.3 105.7 A4.7 4.7 0 0 0 229.3 112.8 A4.7 4.7 0 0 0 237.4 112.8 A4.7 4.7 0 0 0 233.3 105.7'] },
      { say: 'Draw a small triangle beak.', d: ['M183.3 133.3 L216.7 133.3 L200 156.3 L183.3 133.3'] },
      { say: 'Draw a flipper on each side.', d: ['M86.9 169.9 C43.3 224.1 40.2 280.1 64.6 294.8 C78.4 290.2 85.7 273.3 93 256.5', 'M313.1 169.9 C356.7 224.1 359.8 280.1 335.4 294.8 C321.6 290.2 314.3 273.3 307 256.5'] },
      { say: 'Add two feet at the bottom.', d: ['M152.3 351.7 C128.7 371.9 139.4 378.8 163.6 374.9 C177.9 377.8 185.9 374.7 187 366.4', 'M213 366.4 C214.1 374.7 222.1 377.8 236.4 374.9 C260.6 378.8 271.3 371.9 247.7 351.7'] },
      { say: 'Your penguin is ready. Now color it in!', d: [] }
  ] },
  { id: 'frog', name: 'Frog', group: 'Animals', level: 2, steps: [
      { say: 'Draw two circles for the big eyes.', d: ['M121.2 24 A47.3 47.3 0 0 0 80.2 94.9 A47.3 47.3 0 0 0 162.1 94.9 A47.3 47.3 0 0 0 121.2 24', 'M278.8 24 A47.3 47.3 0 0 0 237.9 94.9 A47.3 47.3 0 0 0 319.8 94.9 A47.3 47.3 0 0 0 278.8 24'] },
      { say: 'Add a dot inside each eye.', d: ['M128.5 72.9 A5.8 5.8 0 0 0 123.5 81.5 A5.8 5.8 0 0 0 133.6 81.5 A5.8 5.8 0 0 0 128.5 72.9', 'M271.5 72.9 A5.8 5.8 0 0 0 266.4 81.5 A5.8 5.8 0 0 0 276.5 81.5 A5.8 5.8 0 0 0 271.5 72.9'] },
      { say: 'Draw a wide oval under the eyes for the head.', d: ['M82.6 98.4 A152.4 89.3 0 0 0 200 244.7 A152.4 89.3 0 0 0 317.4 98.4', 'M231.7 68 A152.4 89.3 0 0 0 200 66 A152.4 89.3 0 0 0 168.3 68'] },
      { say: 'Draw a big smile across the face.', d: ['M105.4 176.4 Q200 255.2 294.6 176.4'] },
      { say: 'Add two tiny dots for the nose.', d: ['M184.2 135.4 A4.2 4.2 0 0 0 180.6 141.7 A4.2 4.2 0 0 0 187.9 141.7 A4.2 4.2 0 0 0 184.2 135.4', 'M215.8 135.4 A4.2 4.2 0 0 0 212.1 141.7 A4.2 4.2 0 0 0 219.4 141.7 A4.2 4.2 0 0 0 215.8 135.4'] },
      { say: 'Draw a round body under the head.', d: ['M143.6 238.2 A115.6 73.6 0 0 0 200 376 A115.6 73.6 0 0 0 256.4 238.2'] },
      { say: 'Add a bent leg on each side.', d: ['M92.3 276 A57.8 39.9 -20 0 0 70.8 280.7 A57.8 39.9 -20 0 0 32.3 342.6 A57.8 39.9 -20 0 0 111.4 349.5', 'M307.7 276 A57.8 39.9 20 0 1 329.2 280.7 A57.8 39.9 20 0 1 367.7 342.6 A57.8 39.9 20 0 1 288.6 349.5'] },
      { say: 'Your frog is ready. Now color it in!', d: [] }
  ] },
  { id: 'owl', name: 'Owl', group: 'Animals', level: 2, steps: [
      { say: 'Draw a tall round shape with two pointy ears.', d: ['M73.6 108.3 L94.7 24 L147.3 60.9 Q200 50.3 252.7 60.9 L305.3 24 L326.4 108.3 C347.5 192.6 347.5 329.5 200 371.6 C52.5 329.5 52.5 192.6 73.6 108.3'] },
      { say: 'Draw two big circles for the eyes.', d: ['M152.6 90.4 A44.2 44.2 0 0 0 114.3 156.7 A44.2 44.2 0 0 0 190.9 156.7 A44.2 44.2 0 0 0 152.6 90.4', 'M247.4 90.4 A44.2 44.2 0 0 0 209.1 156.7 A44.2 44.2 0 0 0 285.7 156.7 A44.2 44.2 0 0 0 247.4 90.4'] },
      { say: 'Add a small dot in each eye.', d: ['M160 126.2 A13.7 13.7 0 0 0 148.1 146.7 A13.7 13.7 0 0 0 171.8 146.7 A13.7 13.7 0 0 0 160 126.2', 'M240 126.2 A13.7 13.7 0 0 0 228.2 146.7 A13.7 13.7 0 0 0 251.9 146.7 A13.7 13.7 0 0 0 240 126.2'] },
      { say: 'Draw a small triangle beak under the eyes.', d: ['M187.4 176.7 L200 203.1 L212.6 176.7 L187.4 176.7'] },
      { say: 'Draw a curved wing on each side.', d: ['M64.1 170.4 C129.6 198.1 142.8 271.4 116.6 326.1', 'M335.9 170.4 C270.4 198.1 257.2 271.4 283.4 326.1'] },
      { say: 'Add little V shapes on the tummy for feathers.', d: ['M168.4 240 L178.9 250.5 L189.5 240', 'M210.5 240 L221.1 250.5 L231.6 240', 'M189.5 271.6 L200 282.1 L210.5 271.6', 'M168.4 303.2 L178.9 313.7 L189.5 303.2', 'M210.5 303.2 L221.1 313.7 L231.6 303.2'] },
      { say: 'Draw two little feet at the bottom.', d: ['M147.3 350.6 Q155.8 387.4 163.1 369.5 Q169.5 385 176.6 363.7', 'M223.4 363.7 Q230.5 385 236.9 369.5 Q244.2 387.4 252.7 350.6'] },
      { say: 'Your owl is ready. Now color it in!', d: [] }
  ] },
  { id: 'bee', name: 'Bee', group: 'Animals', level: 2, steps: [
      { say: 'Draw a big oval for the body.', d: ['M104 287.2 A127.5 93.9 0 0 0 325.5 290 A127.5 93.9 0 0 0 215.8 148.3 A127.5 93.9 0 0 0 116.5 183.2'] },
      { say: 'Add a circle on the left for the head.', d: ['M83.2 172.8 A59.2 59.2 0 0 0 31.9 261.5 A59.2 59.2 0 0 0 134.4 261.5 A59.2 59.2 0 0 0 83.2 172.8'] },
      { say: 'Draw two curved stripes on the body.', d: ['M181 151.9 Q169 242.1 181 332.4', 'M252.4 152.4 Q240.5 242.1 252.4 331.9'] },
      { say: 'Add a pointy stinger at the back.', d: ['M341.1 225.5 L376 242.1 L341.1 258.8'] },
      { say: 'Draw two round wings on top.', d: ['M225.6 148.7 A35.7 59.2 -25 0 0 160.2 66.1 A35.7 59.2 -25 0 0 166.2 155.7', 'M277 159.9 A35.7 59.2 25 0 0 286.7 66.1 A35.7 59.2 25 0 0 223.4 121.1'] },
      { say: 'Add a dot for the eye and a smile.', d: ['M65.8 212 A4.6 4.6 0 0 0 61.9 218.9 A4.6 4.6 0 0 0 69.8 218.9 A4.6 4.6 0 0 0 65.8 212', 'M45.4 252.3 Q65.8 269.7 86.2 252.3'] },
      { say: 'Draw two antennas with dots on the head.', d: ['M65.8 177.9 Q52.6 137.1 33.2 128.9', 'M96.4 174.8 Q98.5 133 114.8 116.6', 'M29.1 120.2 A4.6 4.6 0 0 0 25.1 127.1 A4.6 4.6 0 0 0 33.1 127.1 A4.6 4.6 0 0 0 29.1 120.2', 'M118.9 108 A4.6 4.6 0 0 0 114.9 114.9 A4.6 4.6 0 0 0 122.9 114.9 A4.6 4.6 0 0 0 118.9 108'] },
      { say: 'Your bee is ready. Now color it in!', d: [] }
  ] },
  { id: 'butterfly', name: 'Butterfly', group: 'Animals', level: 2, steps: [
      { say: 'Draw a long thin oval in the middle for the body.', d: ['M200 132.4 A18.6 98.4 0 0 0 183.9 280 A18.6 98.4 0 0 0 216.1 280 A18.6 98.4 0 0 0 200 132.4'] },
      { say: 'Add a small circle on top for the head.', d: ['M200 86.9 A22.8 22.8 0 0 0 180.3 121 A22.8 22.8 0 0 0 219.7 121 A22.8 22.8 0 0 0 200 86.9'] },
      { say: 'Draw two big round wings at the top.', d: ['M186.5 163.1 C129.4 67.7 24 56.5 24 137.6 C24 208.8 111.1 233.9 181.4 228', 'M213.5 163.1 C270.6 67.7 376 56.5 376 137.6 C376 208.8 288.9 233.9 218.6 228'] },
      { say: 'Draw two smaller wings at the bottom.', d: ['M181.5 238.2 C115.7 231.1 55.9 262 65.4 318.8 C74.7 365.3 142.5 361.7 186.2 296.6', 'M218.5 238.2 C284.3 231.1 344.1 262 334.6 318.8 C325.3 365.3 257.5 361.7 213.8 296.6'] },
      { say: 'Add round spots on the wings.', d: ['M91.3 112.8 A24.8 24.8 0 0 0 69.8 150 A24.8 24.8 0 0 0 112.8 150 A24.8 24.8 0 0 0 91.3 112.8', 'M308.7 112.8 A24.8 24.8 0 0 0 287.2 150 A24.8 24.8 0 0 0 330.2 150 A24.8 24.8 0 0 0 308.7 112.8', 'M115.1 285.6 A17.6 17.6 0 0 0 99.9 312 A17.6 17.6 0 0 0 130.3 312 A17.6 17.6 0 0 0 115.1 285.6', 'M284.9 285.6 A17.6 17.6 0 0 0 269.7 312 A17.6 17.6 0 0 0 300.1 312 A17.6 17.6 0 0 0 284.9 285.6'] },
      { say: 'Draw two curly antennas on the head.', d: ['M189.6 91 C181.4 60 163.8 44.4 148.2 51.7', 'M210.4 91 C218.6 60 236.2 44.4 251.8 51.7'] },
      { say: 'Your butterfly is ready. Now color it in!', d: [] }
  ] },
  { id: 'turtle', name: 'Turtle', group: 'Animals', level: 2, steps: [
      { say: 'Draw a big half circle for the shell.', d: ['M65.2 243.1 C65.2 63 312.2 63 312.2 243.1 L65.2 243.1'] },
      { say: 'Add a round head peeking out on the right.', d: ['M311.8 231.5 A43.2 43.2 0 0 0 374.6 204.5 A43.2 43.2 0 0 0 332.8 150.5 A43.2 43.2 0 0 0 295.7 171.5'] },
      { say: 'Draw two short legs under the shell.', d: ['M85.8 243.1 L85.8 284.3 Q103.3 299.7 121.8 284.3 L121.8 243.1', 'M235 243.1 L235 284.3 Q252.5 299.7 271 284.3 L271 243.1'] },
      { say: 'Add a small pointy tail on the left.', d: ['M66 226.7 L24 245.2 L65.3 239.4'] },
      { say: 'Draw a shape with six sides in the middle of the shell.', d: ['M221.6 176.2 L205.2 204.7 L172.2 204.7 L155.7 176.2 L172.2 147.7 L205.2 147.7 L221.6 176.2'] },
      { say: 'Draw lines from its corners out to the edge.', d: ['M221.6 176.2 L298.1 176.2', 'M205.2 204.7 L227.3 243.1', 'M172.2 204.7 L150.1 243.1', 'M155.7 176.2 L79.2 176.2', 'M172.2 147.7 L152.4 113.4', 'M205.2 147.7 L225 113.4'] },
      { say: 'Add a dot for the eye and a smile.', d: ['M345.1 176.7 A4.6 4.6 0 0 0 341.1 183.7 A4.6 4.6 0 0 0 349.1 183.7 A4.6 4.6 0 0 0 345.1 176.7', 'M332.8 210.2 Q349.3 220.5 363.7 206'] },
      { say: 'Your turtle is ready. Now color it in!', d: [] }
  ] },
  { id: 'castle', name: 'Castle', group: 'Things', level: 3, steps: [
      { say: 'Draw a pointy triangle roof at the top left.', d: ['M33.8 150.1 L77.8 57.2 L121.8 150.1 L33.8 150.1'] },
      { say: 'Draw two long lines down from the roof for a tower.', d: ['M45.5 150.1 L45.5 375', 'M110 150.1 L110 375'] },
      { say: 'Draw the same roof and tower on the right.', d: ['M366.2 150.1 L322.2 57.2 L278.2 150.1 L366.2 150.1', 'M354.5 150.1 L354.5 375', 'M290 150.1 L290 375'] },
      { say: 'Draw a bumpy line between the towers for the wall top.', d: ['M110 213.7 L130 213.7 L130 192.2 L130 192.2 L150 192.2 L150 213.7 L150 213.7 L170 213.7 L170 192.2 L170 192.2 L190 192.2 L190 213.7 L190 213.7 L210 213.7 L210 192.2 L210 192.2 L230 192.2 L230 213.7 L230 213.7 L250 213.7 L250 192.2 L250 192.2 L270 192.2 L270 213.7 L270 213.7 L290 213.7'] },
      { say: 'Draw a big round door in the middle.', d: ['M168.7 375 L168.7 311.5 A31.3 31.3 0 0 1 200 280.2 A31.3 31.3 0 0 1 231.3 311.5 L231.3 375'] },
      { say: 'Draw a line down the middle of the door.', d: ['M200 280.2 L200 375'] },
      { say: 'Add a window with a round top on each tower.', d: ['M66 243 L66 213.7 A11.7 11.7 0 0 1 77.8 202 A11.7 11.7 0 0 1 89.5 213.7 L89.5 243 L66 243', 'M310.5 243 L310.5 213.7 A11.7 11.7 0 0 1 322.2 202 A11.7 11.7 0 0 1 334 213.7 L334 243 L310.5 243'] },
      { say: 'Draw a round window above the door.', d: ['M200 228.4 A14.7 14.7 0 0 0 187.3 250.4 A14.7 14.7 0 0 0 212.7 250.4 A14.7 14.7 0 0 0 200 228.4'] },
      { say: 'Add a little flag on top of each roof.', d: ['M77.8 57.2 L77.8 25 L107.1 34.8 L77.8 44.5', 'M322.2 57.2 L322.2 25 L351.6 34.8 L322.2 44.5'] },
      { say: 'Draw a long line across the bottom for the ground.', d: ['M24 375 L376 375'] },
      { say: 'Your castle is ready. Now color it in!', d: [] }
  ] },
  { id: 'airplane', name: 'Airplane', group: 'Vehicles', level: 3, steps: [
      { say: 'Draw a long tube shape for the body of the plane.', d: ['M34.5 167.4 L81.8 185.3 L297.2 185.3 C344.5 185.3 376 204.2 376 220 C376 237.8 344.5 254.6 297.2 254.6 L97.6 254.6 C66 254.6 47.1 220 34.5 167.4'] },
      { say: 'Draw a tall fin at the back.', d: ['M43.3 170.7 L32.4 90.7 L68.1 90.7 L124.1 185.3'] },
      { say: 'Add a long wing in the middle.', d: ['M196.6 254.6 L134.3 330.3 L176.4 332.4 L261.3 254.6'] },
      { say: 'Draw a small wing at the back.', d: ['M55.2 224.7 L24 230.5 L32.4 246.2 L68.3 242.1'] },
      { say: 'Add a row of small round windows.', d: ['M118.6 200 A9.5 9.5 0 0 0 110.4 214.2 A9.5 9.5 0 0 0 126.8 214.2 A9.5 9.5 0 0 0 118.6 200', 'M150.1 200 A9.5 9.5 0 0 0 141.9 214.2 A9.5 9.5 0 0 0 158.3 214.2 A9.5 9.5 0 0 0 150.1 200', 'M181.6 200 A9.5 9.5 0 0 0 173.4 214.2 A9.5 9.5 0 0 0 189.8 214.2 A9.5 9.5 0 0 0 181.6 200', 'M213.1 200 A9.5 9.5 0 0 0 204.9 214.2 A9.5 9.5 0 0 0 221.3 214.2 A9.5 9.5 0 0 0 213.1 200', 'M244.7 200 A9.5 9.5 0 0 0 236.5 214.2 A9.5 9.5 0 0 0 252.8 214.2 A9.5 9.5 0 0 0 244.7 200'] },
      { say: 'Draw a window at the front for the pilot.', d: ['M320.3 195.8 Q351.8 195.8 366.5 212.6 L320.3 212.6 L320.3 195.8'] },
      { say: 'Draw a door near the front.', d: ['M278.3 202.1 L299.3 202.1 L299.3 244.1 L278.3 244.1 L278.3 202.1'] },
      { say: 'Draw a line along the side for a stripe.', d: ['M59.5 231.5 L278.3 231.5', 'M299.3 231.5 L371.5 231.5'] },
      { say: 'Add two small fluffy clouds in the sky.', d: ['M283.1 345 A18.9 18.9 0 0 1 297.2 313.5 A26.3 26.3 0 0 1 324.1 288.3 A26.3 26.3 0 0 1 349.7 314.7 A17.9 17.9 0 0 1 364.5 345 L283.1 345', 'M126.5 105.4 A16.8 16.8 0 0 1 142.7 78.4 A23.1 23.1 0 0 1 166.4 55 A23.1 23.1 0 0 1 188.9 79.5 A15.8 15.8 0 0 1 203.9 105.4 L126.5 105.4'] },
      { say: 'Your airplane is ready. Now color it in!', d: [] }
  ] },
  { id: 'train', name: 'Train', group: 'Vehicles', level: 3, steps: [
      { say: 'Draw a long box for the engine.', d: ['M72.9 224 L244 224 L244 312 L72.9 312 L72.9 224'] },
      { say: 'Draw a tall box on the right for the cab.', d: ['M244 224 L244 155.5 L327.1 155.5 L327.1 312 L244 312'] },
      { say: 'Add a flat roof on top of the cab.', d: ['M244 155.5 L229.3 155.5 L229.3 137.9 L341.8 137.9 L341.8 155.5 L327.1 155.5'] },
      { say: 'Draw a square window in the cab.', d: ['M260.6 175.1 L309.5 175.1 L309.5 216.1 L260.6 216.1 L260.6 175.1'] },
      { say: 'Draw a tall chimney on the front.', d: ['M102.2 224 L102.2 175.1 L87.6 145.7 L141.3 145.7 L126.7 175.1 L126.7 224'] },
      { say: 'Add a round bump on top of the engine.', d: ['M164.8 224 A23.5 23.5 0 0 1 188.3 200.5 A23.5 23.5 0 0 1 211.7 224'] },
      { say: 'Draw a pointy shape at the front.', d: ['M72.9 268 L43.6 312 L72.9 312'] },
      { say: 'Draw three wheels under the train.', d: ['M90 312 A29.3 29.3 0 0 0 116.9 353 A29.3 29.3 0 0 0 143.8 312', 'M165.3 312 A29.3 29.3 0 0 0 192.2 353 A29.3 29.3 0 0 0 219.1 312', 'M249.2 312 A37.2 37.2 0 0 0 286 354 A37.2 37.2 0 0 0 322.9 312'] },
      { say: 'Add a dot in the middle of each wheel.', d: ['M116.9 319.3 A4.4 4.4 0 0 0 113.1 325.9 A4.4 4.4 0 0 0 120.7 325.9 A4.4 4.4 0 0 0 116.9 319.3', 'M192.2 319.3 A4.4 4.4 0 0 0 188.4 325.9 A4.4 4.4 0 0 0 196 325.9 A4.4 4.4 0 0 0 192.2 319.3', 'M286 312.4 A4.4 4.4 0 0 0 282.2 319 A4.4 4.4 0 0 0 289.9 319 A4.4 4.4 0 0 0 286 312.4'] },
      { say: 'Draw puffs of smoke above the chimney.', d: ['M119.8 101.7 A14.7 14.7 0 0 0 107.1 123.7 A14.7 14.7 0 0 0 132.5 123.7 A14.7 14.7 0 0 0 119.8 101.7', 'M156 69.5 A19.6 19.6 0 0 0 139.1 98.8 A19.6 19.6 0 0 0 172.9 98.8 A19.6 19.6 0 0 0 156 69.5', 'M204.9 43.1 A24.4 24.4 0 0 0 183.7 79.7 A24.4 24.4 0 0 0 226.1 79.7 A24.4 24.4 0 0 0 204.9 43.1'] },
      { say: 'Draw a long line under the wheels for the track.', d: ['M24 356.9 L376 356.9'] },
      { say: 'Your train is ready. Now color it in!', d: [] }
  ] },
  { id: 'giraffe', name: 'Giraffe', group: 'Animals', level: 3, steps: [
      { say: 'Draw a small oval at the top for the head.', d: ['M103.2 66.8 A46.6 27.2 25 0 0 49.4 86.7 A46.6 27.2 25 0 0 122.6 120.9 A46.6 27.2 25 0 0 103.2 66.8'] },
      { say: 'Add two little horns with round tips.', d: ['M83.7 60.8 L79.7 34.6', 'M107.2 68.9 L109.9 32.7', 'M79.1 25.9 A4.4 4.4 0 0 0 75.3 32.5 A4.4 4.4 0 0 0 82.9 32.5 A4.4 4.4 0 0 0 79.1 25.9', 'M110.2 24 A4.4 4.4 0 0 0 106.4 30.6 A4.4 4.4 0 0 0 114 30.6 A4.4 4.4 0 0 0 110.2 24'] },
      { say: 'Draw a small pointy ear on the back of the head.', d: ['M121.2 78.6 Q150 62.4 159.7 73 Q148.8 86.1 132.5 92.7'] },
      { say: 'Add a dot for the eye and a little smile.', d: ['M89.8 82.3 A4.4 4.4 0 0 0 86 88.8 A4.4 4.4 0 0 0 93.6 88.8 A4.4 4.4 0 0 0 89.8 82.3', 'M51.9 109.9 Q62.6 118.7 75.2 111.9'] },
      { say: 'Draw two long lines down for the neck.', d: ['M101.6 122.5 L153.8 233', 'M135.4 94.4 L213.2 202.2'] },
      { say: 'Draw a big oval for the body.', d: ['M155.2 231 A92.2 56.3 0 0 0 285.6 304.6 A92.2 56.3 0 0 0 237.4 200.2 A92.2 56.3 0 0 0 218.2 201.5'] },
      { say: 'Draw four long legs under the body.', d: ['M162.6 289.4 L162.6 376 L180.1 376 L180.1 300.6', 'M193.7 306.1 L193.7 376 L211.2 376 L211.2 310.5', 'M267.5 309.7 L267.5 376 L285 376 L285 304.7', 'M296.6 299.6 L296.6 376 L314.1 376 L314.1 287.6'] },
      { say: 'Add a thin tail with a little tuft.', d: ['M328.7 246.9 Q352.9 273.1 345.2 300.3', 'M345.2 300.3 A6.8 10.7 0 0 0 339.3 316.3 A6.8 10.7 0 0 0 351 316.3 A6.8 10.7 0 0 0 345.2 300.3'] },
      { say: 'Draw round spots on the body and neck.', d: ['M208.2 230.3 A15.5 11.7 0 0 0 194.8 247.8 A15.5 11.7 0 0 0 221.7 247.8 A15.5 11.7 0 0 0 208.2 230.3', 'M253.9 258.5 A17.5 12.6 0 0 0 238.7 277.4 A17.5 12.6 0 0 0 269 277.4 A17.5 12.6 0 0 0 253.9 258.5', 'M292.7 229.4 A14.6 10.7 0 0 0 280.1 245.4 A14.6 10.7 0 0 0 305.3 245.4 A14.6 10.7 0 0 0 292.7 229.4', 'M188.8 272.1 A11.7 8.7 0 0 0 178.7 285.2 A11.7 8.7 0 0 0 198.9 285.2 A11.7 8.7 0 0 0 188.8 272.1', 'M237.4 216.8 A9.7 7.8 0 0 0 229 228.4 A9.7 7.8 0 0 0 245.8 228.4 A9.7 7.8 0 0 0 237.4 216.8', 'M300.5 273.1 A9.7 7.8 0 0 0 292.1 284.7 A9.7 7.8 0 0 0 308.9 284.7 A9.7 7.8 0 0 0 300.5 273.1', 'M133.5 129.5 A7.8 11.7 25 0 0 120.1 142.5 A7.8 11.7 25 0 0 132.3 148.2 A7.8 11.7 25 0 0 133.5 129.5', 'M152.4 167.4 A8.7 12.6 25 0 0 137.5 181.4 A8.7 12.6 25 0 0 151.3 187.8 A8.7 12.6 25 0 0 152.4 167.4', 'M173.5 199.2 A8.7 9.7 25 0 0 160.5 209.2 A8.7 9.7 25 0 0 174.2 215.6 A8.7 9.7 25 0 0 173.5 199.2', 'M153.7 137 A6.8 8.7 25 0 0 142.8 146.4 A6.8 8.7 25 0 0 153.5 151.3 A6.8 8.7 25 0 0 153.7 137'] },
      { say: 'Your giraffe is ready. Now color it in!', d: [] }
  ] },
  { id: 'elephant', name: 'Elephant', group: 'Animals', level: 3, steps: [
      { say: 'Draw a big circle for the head.', d: ['M102.2 50.5 A73.4 73.4 0 0 0 38.6 160.7 A73.4 73.4 0 0 0 165.8 160.7 A73.4 73.4 0 0 0 102.2 50.5'] },
      { say: 'Add a big ear on the back of the head.', d: ['M143.7 184.3 A50.4 65.1 0 0 0 218.8 147.1 A50.4 65.1 0 0 0 170.4 64.1 A50.4 65.1 0 0 0 150.9 69.2'] },
      { say: 'Draw a long trunk curling down from the head.', d: ['M40.2 163.1 C18.2 210 18.6 271.4 41.3 302.3 Q58.1 318 70.7 300.2 C58.2 271.1 62.2 224.4 88.9 196'] },
      { say: 'Add a dot for the eye and a small smile.', d: ['M81.2 98.2 A4.7 4.7 0 0 0 77.1 105.3 A4.7 4.7 0 0 0 85.3 105.3 A4.7 4.7 0 0 0 81.2 98.2', 'M100.1 165.9 Q114.8 178.5 129.4 165.9'] },
      { say: 'Draw a big oval behind the head for the body.', d: ['M119.2 195.3 A120.7 94.4 0 0 0 329.8 243.4 A120.7 94.4 0 0 0 238.6 87.2 A120.7 94.4 0 0 0 210.4 89.8'] },
      { say: 'Draw four thick legs under the body.', d: ['M149.4 245 L149.4 349.5 L186.1 349.5 L186.1 266.5', 'M201.8 271.4 L201.8 349.5 L238.6 349.5 L238.6 276.1', 'M270 272.8 L270 349.5 L306.8 349.5 L306.8 259.3', 'M317.2 253 L317.2 349.5 L354 349.5 L354 218.4'] },
      { say: 'Add little curves at the bottom of each foot for toes.', d: ['M154.6 349.5 Q160.9 335.9 167.2 349.5', 'M168.3 349.5 Q174.6 335.9 180.8 349.5', 'M207.1 349.5 Q213.4 335.9 219.7 349.5', 'M220.7 349.5 Q227 335.9 233.3 349.5', 'M275.3 349.5 Q281.6 335.9 287.9 349.5', 'M288.9 349.5 Q295.2 335.9 301.5 349.5', 'M322.5 349.5 Q328.8 335.9 335.1 349.5', 'M336.1 349.5 Q342.4 335.9 348.7 349.5'] },
      { say: 'Draw a short tail at the back.', d: ['M358.4 171.8 Q378.6 198.8 370.8 231', 'M369.7 231 A6.3 10.5 0 0 0 364.3 246.7 A6.3 10.5 0 0 0 375.2 246.7 A6.3 10.5 0 0 0 369.7 231'] },
      { say: 'Your elephant is ready. Now color it in!', d: [] }
  ] },
  { id: 'lion', name: 'Lion', group: 'Animals', level: 3, steps: [
      { say: 'Draw a circle for the face.', d: ['M187.6 80.7 A69.6 69.6 0 0 0 127.3 185.1 A69.6 69.6 0 0 0 247.8 185.1 A69.6 69.6 0 0 0 187.6 80.7'] },
      { say: 'Draw a big bumpy ring around it for the mane.', d: ['M158.7 42.5 A31.8 31.8 0 0 1 216.5 42.5 A31.8 31.8 0 0 1 266.5 71.4 A31.8 31.8 0 0 1 295.4 121.4 A31.8 31.8 0 0 1 295.4 179.2 A31.8 31.8 0 0 1 266.5 229.2 A31.8 31.8 0 0 1 216.5 258.1 A31.8 31.8 0 0 1 158.7 258.1 A31.8 31.8 0 0 1 108.7 229.2 A31.8 31.8 0 0 1 79.8 179.2 A31.8 31.8 0 0 1 79.8 121.4 A31.8 31.8 0 0 1 108.7 71.4 A31.8 31.8 0 0 1 158.7 42.5'] },
      { say: 'Add two small round ears on top of the face.', d: ['M154.5 89.1 A17.9 17.9 0 0 0 137.9 77.7 A17.9 17.9 0 0 0 129.9 111.6', 'M245.3 111.6 A17.9 17.9 0 0 0 237.3 77.7 A17.9 17.9 0 0 0 220.6 89.1'] },
      { say: 'Draw two dots for eyes.', d: ['M162.7 130.9 A4.5 4.5 0 0 0 158.8 137.6 A4.5 4.5 0 0 0 166.6 137.6 A4.5 4.5 0 0 0 162.7 130.9', 'M212.4 130.9 A4.5 4.5 0 0 0 208.6 137.6 A4.5 4.5 0 0 0 216.3 137.6 A4.5 4.5 0 0 0 212.4 130.9'] },
      { say: 'Draw two round bumps for the mouth.', d: ['M147.8 178.1 C147.8 214.9 187.6 214.9 187.6 195 C187.6 214.9 227.3 214.9 227.3 178.1'] },
      { say: 'Add a triangle nose with a line under it.', d: ['M187.6 195 L187.6 180.1 L174.6 166.2 L200.5 166.2 L187.6 180.1'] },
      { say: 'Add three tiny dots on each cheek.', d: ['M161.7 187.6 A2.5 2.5 0 0 0 159.6 191.3 A2.5 2.5 0 0 0 163.9 191.3 A2.5 2.5 0 0 0 161.7 187.6', 'M167.7 197.5 A2.5 2.5 0 0 0 165.5 201.2 A2.5 2.5 0 0 0 169.8 201.2 A2.5 2.5 0 0 0 167.7 197.5', 'M157.7 198.5 A2.5 2.5 0 0 0 155.6 202.2 A2.5 2.5 0 0 0 159.9 202.2 A2.5 2.5 0 0 0 157.7 198.5', 'M213.4 187.6 A2.5 2.5 0 0 0 211.3 191.3 A2.5 2.5 0 0 0 215.6 191.3 A2.5 2.5 0 0 0 213.4 187.6', 'M207.5 197.5 A2.5 2.5 0 0 0 205.3 201.2 A2.5 2.5 0 0 0 209.6 201.2 A2.5 2.5 0 0 0 207.5 197.5', 'M217.4 198.5 A2.5 2.5 0 0 0 215.2 202.2 A2.5 2.5 0 0 0 219.6 202.2 A2.5 2.5 0 0 0 217.4 198.5'] },
      { say: 'Draw an oval body under the mane.', d: ['M118.7 255.4 A94.5 71.6 0 0 0 187.6 376 A94.5 71.6 0 0 0 256.4 255.4'] },
      { say: 'Draw two front legs with round paws.', d: ['M144.8 263.6 L144.8 364.1 Q163.7 381 182.6 364.1 L182.6 276.2', 'M192.5 276.2 L192.5 364.1 Q211.4 381 230.3 364.1 L230.3 263.6'] },
      { say: 'Add a long tail with a fluffy tip.', d: ['M277.5 325.9 C318.6 335.9 338.3 298 329.8 265.6', 'M328.8 236.8 A9.9 14.9 0 0 0 320.2 259.2 A9.9 14.9 0 0 0 337.4 259.2 A9.9 14.9 0 0 0 328.8 236.8'] },
      { say: 'Your lion is ready. Now color it in!', d: [] }
  ] }
];
