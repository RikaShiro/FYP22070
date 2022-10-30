import cv2 as cv
import numpy as np

# 目标检测函数，接受三个输入参数
# img_target: 待检测的图像
# img_template: 待识别的目标模版
# threshold: 相似度阈值，缺省设为0.7


def detect_object(img_target, img_template, threshold=0.7):
  img_gray = cv.cvtColor(img_target, cv.COLOR_BGR2GRAY)
  w, h = img_template.shape[::-1]

  # 调用opencv的matchTemplate方法进行相似度匹配
  res = cv.matchTemplate(img_gray, img_template, cv.TM_CCOEFF_NORMED)
  # 移除相似度低于阈值的位置
  loc = np.where(res >= threshold)

  result = []
  for pt in zip(*loc[::-1]):
    # 我们希望返回检测边框Bounding Box列表，包括每个边框的左上角位置和
    # 宽高
    bbox = [pt[0], pt[1], w, h]
    result.append(bbox)
  return result


# 读取素材图像
img_rgb = cv.imread('./screenshot.PNG')
template = cv.imread('./nan.PNG', 0)

# 调用目标检测函数，并根据返回的边框列表，在原始图像上标注
bboxes = detect_object(img_rgb, template)
for bbox in bboxes:
  cv.rectangle(img_rgb, (bbox[0], bbox[1]),
               (bbox[0]+bbox[2], bbox[1]+bbox[3]), (0, 255, 255), 2)

cv.imwrite('result.png', img_rgb)
