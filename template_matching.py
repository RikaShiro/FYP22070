import cv2 as cv
import numpy as np

def detect_object(img_target, img_template, threshold=0.6):
  img_gray = cv.cvtColor(img_target, cv.COLOR_BGR2GRAY)
  w, h = img_template.shape[::-1]
  res = cv.matchTemplate(img_gray, img_template, cv.TM_CCOEFF_NORMED)
  print(res)
  loc = np.where(res >= threshold)

  result = []
  for pt in zip(*loc[::-1]):
    bbox = [pt[0], pt[1], w, h]
    result.append(bbox)
  return result


img_rgb = cv.imread('./result.PNG')
template = cv.imread('./images/singleTiles/16.PNG', 0)

bboxes = detect_object(img_rgb, template)
for bbox in bboxes:
  cv.rectangle(img_rgb, (bbox[0], bbox[1]),
               (bbox[0]+bbox[2], bbox[1]+bbox[3]), (0, 255, 255), 2)
cv.imwrite('match_result.PNG', img_rgb)
