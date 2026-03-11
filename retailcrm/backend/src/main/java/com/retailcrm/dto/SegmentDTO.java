package com.retailcrm.dto;

import com.retailcrm.model.enums.CustomerTag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SegmentDTO {
    private CustomerTag tag;
    private long count;
}
